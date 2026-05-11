import { Router } from "express";
import * as controller from "./user.controller.js";
import { validateZod } from "../../middlewares/validateZod.middleware.js";
import { loginSchema } from "./schemas/auth.schema.js";
import { createUserSchema } from "./schemas/user.schema.js";
import authMiddleware from "../../middlewares/auth.Middleware.js";
import {
  changePasswordSchema,
  passwordSchema,
} from "./schemas/ChangePassword.schema.js";
import emailService from "../../services/email.service.js";

const router = Router();

// User1
// danielaldana212@gmail.com
// 1094884731@Da

// User1
// aldanadaniel162@gmail.com
// vqxxu0s19n
// 1094884731@Da

router.get("/", authMiddleware, controller.getAll);

router.get("/stats", authMiddleware, controller.getStats);

router.get("/:id", authMiddleware, controller.getById);

router.post("/login", validateZod(loginSchema), controller.login);

router.post(
  "/signup",
  authMiddleware,
  validateZod(createUserSchema),
  controller.signup,
);

router.put("/:id", authMiddleware, controller.update);

router.patch(
  "/complete-password-setup",
  validateZod(passwordSchema),
  authMiddleware,
  controller.completePasswordSetup,
);

router.patch("/:id/status", authMiddleware, controller.updateStatus);

router.patch(
  "/change-password",
  validateZod(changePasswordSchema),
  authMiddleware,
  controller.changePassword,
);

router.delete("/:id", authMiddleware, controller.remove);

export default router;
