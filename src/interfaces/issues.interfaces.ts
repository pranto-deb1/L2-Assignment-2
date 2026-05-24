export interface IIssue {
  title: string;
  description: string;
  type: string;
}

export type IIssueSort = "newest" | "oldest";

export interface IIssueFilters {
  sort?: IIssueSort;
  type?: string;
  status?: string;
}
