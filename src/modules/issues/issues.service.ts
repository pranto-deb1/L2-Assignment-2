import { error } from "node:console";
import config from "../../config";
import { pool } from "../../db";
import type {
  IIssue,
  IIssueFilters,
  IupdateIssue,
} from "../../interfaces/issues.interfaces";
import jwt from "jsonwebtoken";
import { createError } from "../../errorHelper/errorHelper";
import { UserRoles } from "../../types";

// create issue
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

// get all issues
const getAllIssuesDB = async (filters: IIssueFilters) => {
  const { sort = "newest", type, status } = filters;
  let query = `SELECT * FROM issues WHERE 1=1`;
  const queryParams: string[] = [];

  if (type) {
    queryParams.push(type);
    query += ` AND type = $${queryParams.length}`;
  }
  if (status) {
    queryParams.push(status);
    query += ` AND status = $${queryParams.length}`;
  }

  query +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issuesResult = await pool.query(query, queryParams);
  const issues = issuesResult.rows;

  if (issues.length === 0) {
    throw createError("Issues not found", 404);
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const userMap = new Map(usersResult.rows.map((user) => [user.id, user]));

  return issues.map((issue) => {
    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: userMap.get(reporter_id) || null,
    };
  });
};

// get one issue
const getSingleIssueDB = async (id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);
  const issue = issueResult.rows[0];
  if (!issue) return null;

  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );
  const { reporter_id, ...rest } = issue;

  return {
    ...rest,
    reporter: userResult.rows[0] || null,
  };
};

// update issue
const updateIssueDB = async (
  payload: IupdateIssue,
  issueId: string,
  token: string,
) => {
  const { title, description, type } = payload;
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [issueId],
  );

  if (issueResult.rows.length === 0) {
    throw createError("Issue not found", 404);
  }

  const reporterId = issueResult.rows[0].reporter_id;
  const decodedToken = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
  if (
    decodedToken.id !== reporterId &&
    decodedToken.role !== UserRoles.Maintainer
  ) {
    throw createError("Unauthorized", 403);
  }

  const result = await pool.query(
    `
  UPDATE issues
  SET
    title = COALESCE($1, title),
    description = COALESCE($2, description),
    type = COALESCE($3, type)
  WHERE id = $4
  RETURNING *
  `,
    [title ?? null, description ?? null, type ?? null, issueId],
  );

  return result.rows[0];
};

// Delete issue
const deleteIssueDB = async (issueId: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [issueId],
  );
  if (issueResult.rows.length === 0) {
    throw createError("Issue not found", 404);
  }
  await pool.query(`DELETE FROM issues WHERE id = $1`, [issueId]);
};

export const issuesService = {
  createIssueDB,
  getAllIssuesDB,
  getSingleIssueDB,
  updateIssueDB,
  deleteIssueDB,
};
