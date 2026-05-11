import { Router } from "express";
import * as controller from "./movement.controller.js";
import authMiddleware from "../../middlewares/auth.Middleware.js";

const router = Router();

router.get("/", authMiddleware, controller.getAll);
router.get("/stats", authMiddleware, controller.getStats);
router.get("/:id", authMiddleware, controller.getById);
router.post("/", authMiddleware, controller.create);
router.put("/:id", authMiddleware, controller.update);

export default router;
