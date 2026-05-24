import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authIssues } from "../../middlewares/auth";
import { UserRoles } from "../../types";

const route = Router();

route.post(
  "/",
  authIssues(UserRoles.Contributor, UserRoles.Maintainer),
  issuesController.createIssue,
);

route.get("/", issuesController.getAll);

export const issuesRoute = route;
