import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { CustomRequest } from "../../middlewares/auth";
import type { AppError } from "../../interfaces/issues.interfaces";
import { utilitys } from "../../utilitys/response";

// create issues
const createIssue = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json(utilitys.ReturnErrorResponse("Request body is required"));
    }

    const userId = req.user?.id;

    const data = await issuesService.createIssueDB(req.body, Number(userId));
    res
      .status(201)
      .json(utilitys.ReturnSuccessResponse("Issue created successfully", data));
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res
        .status(err.status)
        .json(utilitys.ReturnErrorResponse(err.message));
    }

    return res
      .status(500)
      .json(utilitys.ReturnErrorResponse("Internal server error"));
  }
};

// get all issues
const getAll = async (req: Request, res: Response) => {
  try {
    const data = await issuesService.getAllIssuesDB(req.query);
    res
      .status(200)
      .json(
        utilitys.ReturnSuccessResponse("Issues retrieved successfully", data),
      );
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res
        .status(err.status)
        .json(utilitys.ReturnErrorResponse(err.message));
    }

    return res
      .status(500)
      .json(utilitys.ReturnErrorResponse("Internal server error"));
  }
};

const getOne = async (req: Request, res: Response) => {
  try {
    const data = await issuesService.getSingleIssueDB(req.params.id as string);
    if (!data)
      return res
        .status(404)
        .json(utilitys.ReturnErrorResponse("Issue not found"));
    res
      .status(200)
      .json(
        utilitys.ReturnSuccessResponse("Issue retrieved successfully", data),
      );
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res
        .status(err.status)
        .json(utilitys.ReturnErrorResponse(err.message));
    }

    return res
      .status(500)
      .json(utilitys.ReturnErrorResponse("Internal server error"));
  }
};

// update issue
const update = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json(utilitys.ReturnErrorResponse("Unauthorized access"));
    }
    const data = await issuesService.updateIssueDB(
      req.body,
      req.params.id as string,
      req.headers.authorization as string,
    );

    res
      .status(200)
      .json(utilitys.ReturnSuccessResponse("Issue updated successfully", data));
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res
        .status(err.status)
        .json(utilitys.ReturnErrorResponse(err.message));
    }

    return res
      .status(500)
      .json(utilitys.ReturnErrorResponse("Internal server error"));
  }
};

// delete issue
const deleteIssue = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json(utilitys.ReturnErrorResponse("Issue ID is required"));
  }
  try {
    await issuesService.deleteIssueDB(req.params.id as string);
    res
      .status(200)
      .json(utilitys.ReturnSuccessResponse("Issue deleted successfully"));
  } catch (error) {
    const err = error as AppError;

    if (err.status) {
      return res
        .status(err.status)
        .json(utilitys.ReturnErrorResponse(err.message));
    }

    return res
      .status(500)
      .json(utilitys.ReturnErrorResponse("Internal server error"));
  }
};

export const issuesController = {
  createIssue,
  getAll,
  getOne,
  update,
  deleteIssue,
};
