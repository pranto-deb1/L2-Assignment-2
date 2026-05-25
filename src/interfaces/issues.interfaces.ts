import type { Request } from "express";

export interface IIssue {
  title: string;
  description: string;
  type: string;
}

type IIssueSort = "newest" | "oldest";

export interface IIssueFilters {
  sort?: IIssueSort;
  type?: string;
  status?: string;
}

export interface IIssue {
  title: string;
  description: string;
  type: string;
}

export interface IUser {
  id: number;
  role: string;
}

export interface IupdateIssue {
  title: string;
  description: string;
  type: string;
}


export type AppError = {
  message: string;
  status: number;
};