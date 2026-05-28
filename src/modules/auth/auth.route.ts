import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();
route.post("/signup", authController.registerUser);
route.post("/login", authController.loginUser);

export const authRoute = route;
