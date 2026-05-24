import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { CustomRequest } from "../../middlewares/auth";

// create issues
const createIssue = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty",
      });
    }

    const userId = req.user?.id;

    const data = await issuesService.createIssueDB(req.body, Number(userId));
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating issue",
      error,
    });
  }
};

// get all issues
const getAll = async (req: Request, res: Response) => {
  try {
    const data = await issuesService.getAllIssuesDB(req.query);
    res
      .status(200)
      .json({ success: true, message: "Issues retrieved successfully", data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating issue",
      error,
    });
  }
};

export const issuesController = {
  createIssue,
  getAll,
};
