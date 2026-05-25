import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { CustomRequest } from "../../middlewares/auth";
import type { AppError } from "../../interfaces/issues.interfaces";

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
    const err = error as AppError;

    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
    const err = error as AppError;

    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getOne = async (req: Request, res: Response) => {
  try {
    const data = await issuesService.getSingleIssueDB(req.params.id as string);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    res
      .status(200)
      .json({ success: true, message: "Issue retrieved successfully", data });
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update issue
const update = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const data = await issuesService.updateIssueDB(
      req.body,
      req.params.id as string,
      req.headers.authorization as string,
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data,
    });
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete issue
const deleteIssue = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Issue ID is required",
    });
  }
  try {
    await issuesService.deleteIssueDB(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const issuesController = {
  createIssue,
  getAll,
  getOne,
  update,
  deleteIssue,
};
