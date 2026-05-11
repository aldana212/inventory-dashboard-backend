import { Router } from "express";
import * as controller from "./user.controller.js";
import { validateZod } from "../../middlewares/validateZod.middleware.js";
import { createUserSchema } from "./schemas/user.schema.js";
import authMiddleware from "../../middlewares/auth.Middleware.js";
import emailService from "../../services/email.service.js";

const router = Router();

router.get("/", authMiddleware, controller.getAll);

router.get("/stats", authMiddleware, controller.getStats);

router.get("/:id", authMiddleware, controller.getById);

router.post(
  "/",
  authMiddleware,
  validateZod(createUserSchema),
  controller.create,
);

router.put("/:id", authMiddleware, controller.update);

router.patch("/:id/status", authMiddleware, controller.updateStatus);

router.delete("/:id", authMiddleware, controller.remove);

export default router;
