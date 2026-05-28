import config from "../../config";
import { pool } from "../../db";
import { createError } from "../../errorHelper/errorHelper";
import type {
  IUserLogin,
  IUserRegister,
} from "../../interfaces/auth.interfaces";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUserDB = async (userData: IUserRegister) => {
  const { name, email, password, role } = userData;
  const checkIfExist = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );
  if (checkIfExist.rows.length !== 0) {
    throw createError("User already exists", 409);
  }
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

const loginUserDB = async (userData: IUserLogin) => {
  const { email, password } = userData;
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );
  if (result.rows.length === 0) {
    throw createError("Invalid credentials", 401);
  }
  const matchPassword = await bycrypt.compare(
    password,
    result.rows[0].password,
  );
  if (!matchPassword) {
    throw createError("Invalid credentials", 401);
  }
  delete result.rows[0].password;
  const jwtPayload = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
  };
  const token = jwt.sign(jwtPayload, config.JWT_SECRET, { expiresIn: "1d" });
  return { token, user: result.rows[0] };
};

export const authService = {
  registerUserDB,
  loginUserDB,
};
