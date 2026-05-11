import { Router } from "express";

import * as controller from "./auth.controller.js";

import authMiddleware from "../../middlewares/auth.Middleware.js";

import { validateZod } from "../../middlewares/validateZod.middleware.js";

import {
  loginSchema,
} from "./schemas/login.schema.js";

import {
  changePasswordSchema,
} from "./schemas/changePassword.schema.js";

const router = Router();

router.post(
  "/login",
  validateZod(loginSchema),
  controller.login
);

router.patch(
  "/complete-password-setup",
  authMiddleware,
  validateZod(changePasswordSchema),
  controller.completePasswordSetup
);

router.patch(
  "/change-password",
  authMiddleware,
  validateZod(changePasswordSchema),
  controller.changePassword
);

export default router;