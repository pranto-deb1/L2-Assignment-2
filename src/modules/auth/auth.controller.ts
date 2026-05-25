import type { Request, Response } from "express";
import { authService } from "./auth.service";
import type { AppError } from "../../interfaces/issues.interfaces";

const registerUser = async (req: Request, res: Response) => {
  try {
    const data = await authService.registerUserDB(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const data = await authService.loginUserDB(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
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

export const authController = {
  registerUser,
  loginUser,
};
