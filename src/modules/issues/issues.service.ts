import { pool } from "../../db";
import type { IIssue, IIssueFilters } from "../../interfaces/issues.interfaces";

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
    throw new Error("Issues not found");
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

export const issuesService = {
  createIssueDB,
  getAllIssuesDB,
  getSingleIssueDB,
};
