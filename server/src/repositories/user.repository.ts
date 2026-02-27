// src/repositories/user.repository.ts
import { pool } from '../config/db';

export const createUser = async (username: string, email: string, passwordHash: string, token: string) => {
  try {
    await pool.query(
      `INSERT INTO users (username, email, password, verification_token)
       VALUES ($1, $2, $3, $4)`,
      [username, email, passwordHash, token]
    );
  } catch (err: any) {
    // database specific errors
    if (err.code === "23505") {
      if (err.constraint === "users_email_key") throw new Error("Email already exists");
      if (err.constraint === "users_username_key") throw new Error("Username already taken");
      throw new Error("Duplicate value");
    }
    throw err;
  }
};

export const findVerifiedUserByEmail = async (email: string) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND is_verified = TRUE',
    [email]
  );
  return result.rows[0] || null;
};

export const findUserByToken = async (token: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE verification_token = $1",
    [token]
  );
  return result.rows[0] || null;
};

export const updateVerificationToken = async (email: string, token: string) => {
  await pool.query(
    `UPDATE users SET verification_token = $1 WHERE email = $2`,
    [token, email]
  );
};

export const verifyUser = async (token: string) => {
  const result = await pool.query(
    `UPDATE users
     SET is_verified = true, verification_token = NULL
     WHERE verification_token = $1 RETURNING *`,
    [token]
  );
  return result.rows[0];
};

export const updatePassword = async (token: string, passwordHash: string) => {
  const result = await pool.query(
    `UPDATE users
     SET password = $1, verification_token = NULL
     WHERE verification_token = $2 AND is_verified = TRUE RETURNING *`,
    [passwordHash, token]
  );
  return result.rows[0];
};

export const findUserById = async (id: number | string) => {
  const result = await pool.query(
    "SELECT id, username, email, profile FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// FOR PASSPORT GOOGLE AUTH
export const findUserByGoogleId = async (googleId: string) => {
  const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
  return result.rows[0] || null;
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const linkGoogleAccount = async (email: string, googleId: string) => {
  const result = await pool.query(
    "UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *",
    [googleId, email]
  );
  return result.rows[0];
};

// For users who are not verified
export const verifyAndLinkGoogleAccount = async (email: string, googleId: string) => {
  const result = await pool.query(
    `UPDATE users
     SET google_id = $1, is_verified = true, verification_token = NULL
     WHERE email = $2
     RETURNING *`,
    [googleId, email]
  );
  return result.rows[0];
};

export const createGoogleUser = async (username: string, email: string, googleId: string, profilePic: string) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, google_id, profile, is_verified) VALUES ($1, $2, $3, $4, true) RETURNING *",
    [username, email, googleId, profilePic]
  );
  return result.rows[0];
};
