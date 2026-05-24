import { pool } from "../../db";
import type { IIssue } from "../../interfaces/issues.interfaces";

const createIssueDB = async (payload: IIssue, userId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [title, description, type, userId],
  );

  return result.rows[0];
};

export const issuesService = {
  createIssueDB,
};
