import type { Request, Response } from "express";
import { authService } from "./auth.service";

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

export const authController = {
  registerUser,
};
