import type { AppError } from "../interfaces/issues.interfaces";

export const createError = (message: string, status: number): AppError => {
  return { message, status };
};
