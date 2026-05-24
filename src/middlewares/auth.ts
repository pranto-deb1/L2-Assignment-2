import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { IUserMiddleware } from "../interfaces/auth.interfaces";
export interface CustomRequest extends Request {
  user?: IUserMiddleware;
}

export const authIssues =
  (...allowedRoles: string[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const decodedToken = jwt.verify(
        token,
        config.JWT_SECRET,
      ) as jwt.JwtPayload;

      const userData = await pool.query(
        `
    SELECT * FROM users WHERE email = $1
    `,
        [decodedToken.email],
      );

      if (userData.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "cannot find user",
        });
      }

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userData.rows[0].role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      delete userData.rows[0].password;
      req.user = userData.rows[0];

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error,
      });
    }
  };
