import { pool } from '../config/db';
import { QuizInput } from '../types/quiz.types';

export const findQuizById = async (quizId: string) => {
  const result = await pool.query('SELECT id, user_id FROM quiz WHERE id = $1', [quizId]);
  return result.rows[0] || null;
};

/**
 * Fetches all quizzes for user
 * Example Return Struct:
 *  [{
 *  "id": 1, "title": "JavaScript Basics",
 *  "description": "Test your knowledge of core JS concepts.",
 *  "questions": [
 *  { "id": 101,
 *    "text": "What keyword is used to declare a block-scoped variable?",
 *    "position": 1,
 *    "choices": [
 *      { "label": "A", "text": "var", "is_correct": false },
 *      { "label": "B", "text": "let", "is_correct": true }
 *    ]
 *  }]
 */
export const getQuizzesByUserId = async (userId: string) => {
  const result = await pool.query(
    `SELECT
      q.id, q.title, q.description,
      COALESCE(
        json_agg(
          json_build_object(
            'id', qu.id,
            'text', qu.question_text,
            'position', qu.position,
            'choices', (
              SELECT json_agg(
                json_build_object('label', c.choice_label, 'text', c.choice_text, 'is_correct', c.is_correct)
              ) FROM choice c WHERE c.question_id = qu.id
            )
          ) ORDER BY qu.position
        ) FILTER (WHERE qu.id IS NOT NULL), '[]'
      ) as questions
    FROM quiz q
    LEFT JOIN question qu ON q.id = qu.quiz_id
    WHERE q.user_id = $1
    GROUP BY q.id`,
    [userId]
  );
  return result.rows;
};


export const createQuizTransaction = async (userId: string, quizData: QuizInput): Promise<string> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const quizResult = await client.query(
      `INSERT INTO quiz (user_id, title, description) VALUES ($1, $2, $3) RETURNING id`,
      [userId, quizData.title, quizData.description]
    );
    const quizId = quizResult.rows[0].id;

    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      const questionResult = await client.query(
        `INSERT INTO question (quiz_id, question_text, position) VALUES ($1, $2, $3) RETURNING id`,
        [quizId, question.text, i + 1]
      );
      const questionId = questionResult.rows[0].id;

      for (const choice of question.choices) {
        await client.query(
          `INSERT INTO choice (question_id, choice_label, choice_text, is_correct) VALUES ($1, $2, $3, $4)`,
          [questionId, choice.label, choice.text, choice.label === question.correct]
        );
      }
    }

    await client.query('COMMIT');
    return quizId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateQuizTransaction = async (quizId: string, quizData: QuizInput) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE quiz SET title = $1, description = $2 WHERE id = $3',
      [quizData.title, quizData.description, quizId]
    );

    await client.query(`DELETE FROM choice WHERE question_id IN (SELECT id FROM question WHERE quiz_id = $1)`, [quizId]);
    await client.query(`DELETE FROM question WHERE quiz_id = $1`, [quizId]);

    // Re-insert questions/choices
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      const questionResult = await client.query(
        `INSERT INTO question (quiz_id, question_text, position) VALUES ($1, $2, $3) RETURNING id`,
        [quizId, question.text, i + 1]
      );
      const questionId = questionResult.rows[0].id;

      for (const choice of question.choices) {
        await client.query(
          `INSERT INTO choice (question_id, choice_label, choice_text, is_correct) VALUES ($1, $2, $3, $4)`,
          [questionId, choice.label, choice.text, choice.label === question.correct]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteQuizById = async (quizId: string) => {
  await pool.query(`DELETE FROM quiz WHERE id = $1`, [quizId]);
};