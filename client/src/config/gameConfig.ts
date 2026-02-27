// gameConfig.ts

// --- CONSTANTS ---
export const QUESTION_TIMER_SECONDS = 5;

export const Canvas = {
    width: 800,
    height: 600
};

export const PlayArea = {
    leftPanelPct: 0.35,
    startX: Canvas.width * 0.35,
    width: Canvas.width - (Canvas.width * 0.35),
    midX: (Canvas.width * 0.35) + ((Canvas.width - (Canvas.width * 0.35)) / 2),
    midY: Canvas.height / 2
};

export const COLORS = {
    A: '#F6E6B8',
    B: '#FECB56',
    C: '#CFE6A8',
    D: '#E7C2A8',
};

export const BeeSprite = {
    sheetSize: 640,
    columns: 4,
    frameWidth: 640 / 4, //sheetSize / cols
    frameHeight: 640 / 4, //sheerSize / rows
    displaySize: 70
};

export const FlowerSprite = {
    frameWidth: 220,
    frameHeight: 320,
};

// --- TYPES ---
export type GameMode = 'menu' | 'quiz' | 'gameover' | 'loading';
export type ModalType = 'select_mode' | 'select_quiz' | 'ready_confirmation' | 'options' | 'exit' | 'pause'| 'custom_menu'|'create_quiz' | 'delete_confirmation' | null;
export type GameType = "preset" | "custom" | "custom_new" | "selection" ;

export type Question = {
    id: number;
    text: string;
    choices: { label: string; text: string }[];
    correct: string;
}

export type QuizSet = {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    isCustom?: boolean;
}

export type Entity = {
    pos: { x: number; y: number };
    width: number;
    height: number;
}

export type Flower = Entity & {
    id: string;
    label: string;
    isHovered: boolean;
}

export type Bee = Entity & {
    velocity: { x: number; y: number };
    speed: number;
    direction: 'left' | 'right';
    isMoving: boolean;
    frameIndex: number;
    rowIndex: number;
    tickCount: number;
    ticksPerFrame: number;
}


// --- DATA ---
export const QUIZ_SETS: QuizSet[] = [
    {
        id: 'math_easy',
        title: 'Math Basics',
        description: 'Simple addition and numbers.',
        questions: [
            {
                id: 1, text: "What is 2 + 2?",
                choices: [{ label: 'A', text: '3' }, { label: 'B', text: '4' }, { label: 'C', text: '5' }],
                correct: 'B'
            },
            {
                id: 2, text: "Which number is even?",
                choices: [{ label: 'A', text: '1' }, { label: 'B', text: '3' }, { label: 'C', text: '8' }],
                correct: 'C'
            },
            {
                id: 2, text: "What is the cube root of 27?",
                choices: [{ label: 'A', text: '4' }, { label: 'B', text: '3' }, { label: 'C', text: '7' }, { label: 'D', text: '9'}],
                correct: 'B'
            }
        ]
    },
    {
        id: 'psychology_101',
        title: 'Psychology 101',
        description: 'Questions about the human mind and behavior.',
        questions: [
            {
                id: 1,
                text: "What is the scientific study of the mind and behavior called?",
                choices: [
                    { label: 'A', text: 'Sociology' },
                    { label: 'B', text: 'Psychology' },
                    { label: 'C', text: 'Philosophy' },
                    { label: 'D', text: 'Biology' }
                ],
                correct: 'B'
            },
            {
                id: 2,
                text: "Which famous scientist is known for ringing a bell to make dogs salivate?",
                choices: [
                    { label: 'A', text: 'Sigmund Freud' },
                    { label: 'B', text: 'B.F. Skinner' },
                    { label: 'C', text: 'Ivan Pavlov' },
                    { label: 'D', text: 'Albert Bandura' }
                ],
                correct: 'C'
            },
            {
                id: 3,
                text: "Who is widely considered the founder of psychoanalysis?",
                choices: [
                    { label: 'A', text: 'Sigmund Freud' },
                    { label: 'B', text: 'Carl Jung' },
                    { label: 'C', text: 'William James' },
                    { label: 'D', text: 'John B. Watson' }
                ],
                correct: 'A'
            },
            {
                id: 4,
                text: "What term describes a persistent, irrational fear of a specific object or situation?",
                choices: [
                    { label: 'A', text: 'Delusion' },
                    { label: 'B', text: 'Mania' },
                    { label: 'C', text: 'Phobia' },
                    { label: 'D', text: 'Anxiety' }
                ],
                correct: 'C'
            },
            {
                id: 5,
                text: "Which part of the brain is primarily associated with forming new memories?",
                choices: [
                    { label: 'A', text: 'Cerebellum' },
                    { label: 'B', text: 'Hippocampus' },
                    { label: 'C', text: 'Brainstem' },
                    { label: 'D', text: 'Amygdala' }
                ],
                correct: 'B'
            },
            {
                id: 6,
                text: "What is the term for a false belief held despite strong contradictory evidence?",
                choices: [
                    { label: 'A', text: 'Illusion' },
                    { label: 'B', text: 'Hallucination' },
                    { label: 'C', text: 'Delusion' },
                    { label: 'D', text: 'Mirage' }
                ],
                correct: 'C'
            },
            {
                id: 7,
                text: "Which psychological disorder is characterized by prolonged feelings of deep sadness and loss of interest?",
                choices: [
                    { label: 'A', text: 'Schizophrenia' },
                    { label: 'B', text: 'Depression' },
                    { label: 'C', text: 'Bipolar Disorder' },
                    { label: 'D', text: 'OCD' }
                ],
                correct: 'B'
            },
            {
                id: 8,
                text: "What do we call the body's physical or mental response to a demanding or threatening situation?",
                choices: [
                    { label: 'A', text: 'Stress' },
                    { label: 'B', text: 'Euphoria' },
                    { label: 'C', text: 'Apathy' },
                    { label: 'D', text: 'Empathy' }
                ],
                correct: 'A'
            }
        ]
    },
    {
        id: 'hamilton_trivia',
        title: 'Hamilton Trivia',
        description: 'Questions about the hit musical Hamilton.',
        questions: [
            {
                id: 1,
                text: "Who wrote the music, lyrics, and book for the musical Hamilton?",
                choices: [
                    { label: 'A', text: 'Lin-Manuel Quezon' },
                    { label: 'B', text: 'Lin-Manuel Miranda' },
                    { label: 'C', text: 'Alexander Hamilton' },
                    { label: 'D', text: 'Aaron Burr' }
                ],
                correct: 'B'
            },
            {
                id: 2,
                text: "Which historical figure shoots Alexander Hamilton in a duel?",
                choices: [
                    { label: 'A', text: 'Thomas Jefferson' },
                    { label: 'B', text: 'George Washington' },
                    { label: 'C', text: 'Aaron Burr' },
                    { label: 'D', text: 'James Madison' }
                ],
                correct: 'C'
            },
            {
                id: 3,
                text: "Which of the Schuyler sisters does Alexander Hamilton marry?",
                choices: [
                    { label: 'A', text: 'Peggy' },
                    { label: 'B', text: 'Angelica' },
                    { label: 'C', text: 'Maria' },
                    { label: 'D', text: 'Eliza' }
                ],
                correct: 'D'
            },
            {
                id: 4,
                text: "Which U.S. currency bill features Alexander Hamilton's face?",
                choices: [
                    { label: 'A', text: 'The $1 bill' },
                    { label: 'B', text: 'The $5 bill' },
                    { label: 'C', text: 'The $10 bill' },
                    { label: 'D', text: 'The $20 bill' }
                ],
                correct: 'C'
            },
            {
                id: 5,
                text: "Which King of England serves as the musical's comedic antagonist?",
                choices: [
                    { label: 'A', text: 'King George III' },
                    { label: 'B', text: 'King Henry VIII' },
                    { label: 'C', text: 'King Edward IV' },
                    { label: 'D', text: 'King Charles II' }
                ],
                correct: 'A'
            },
            {
                id: 6,
                text: "In the musical, what city serves as the primary setting for the story?",
                choices: [
                    { label: 'A', text: 'Philadelphia' },
                    { label: 'B', text: 'Boston' },
                    { label: 'C', text: 'Washington D.C.' },
                    { label: 'D', text: 'New York City' }
                ],
                correct: 'D'
            },
            {
                id: 7,
                text: "Which character famously sings the song 'Satisfied' at the wedding?",
                choices: [
                    { label: 'A', text: 'Eliza Schuyler' },
                    { label: 'B', text: 'Angelica Schuyler' },
                    { label: 'C', text: 'Peggy Schuyler' },
                    { label: 'D', text: 'Maria Reynolds' }
                ],
                correct: 'B'
            },
            {
                id: 8,
                text: "Who is the first President of the United States in the musical?",
                choices: [
                    { label: 'A', text: 'Thomas Jefferson' },
                    { label: 'B', text: 'Alexander Hamilton' },
                    { label: 'C', text: 'John Adams' },
                    { label: 'D', text: 'George Washington' }
                ],
                correct: 'D'
            }
        ]
    }
];