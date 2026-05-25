import type { Request, Response } from "express";
import { authService } from "./auth.service";
import type { AppError } from "../../interfaces/issues.interfaces";
import { utilitys } from "../../utilitys/response";

const registerUser = async (req: Request, res: Response) => {
  try {
    const data = await authService.registerUserDB(req.body);
    res
      .status(201)
      .json(
        utilitys.ReturnSuccessResponse("User registered successfully", data),
      );
  } catch (error) {
    res
      .status(500)
      .json(utilitys.ReturnErrorResponse("Error registering user"));
  }
};

const loginUser = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json(utilitys.ReturnErrorResponse("Email and password are required"));
  }
  try {
    const data = await authService.loginUserDB(req.body);
    res
      .status(200)
      .json(utilitys.ReturnSuccessResponse("Login successful", data));
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

export const authController = {
  registerUser,
  loginUser,
};
