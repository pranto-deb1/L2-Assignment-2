import { pool } from "../../db";
import type { IUser } from "../../interfaces/auth.interfaces";
import bycrypt from "bcrypt";

const registerUserDB = async (userData: IUser) => {
  const { name, email, password, role } = userData;
  const hashedPassword = await bycrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [name, email, hashedPassword, role],
  );

  delete result.rows[0].password;
  return result.rows[0];
};

export const authService = {
  registerUserDB,
};
