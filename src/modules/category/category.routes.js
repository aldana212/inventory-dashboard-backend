import { Router } from "express";
import * as controller from "./category.controller.js";
import authMiddleware from "../../middlewares/auth.Middleware.js";

const router = Router();

router.get("/", authMiddleware, controller.getAll);
router.get("/getStats", authMiddleware, controller.getStats);
router.get("/:id", authMiddleware, controller.getById);
router.post("/", authMiddleware, controller.create);
router.put("/:id", authMiddleware, controller.update);
router.patch("/:id/status", authMiddleware, controller.updateStatus);
router.delete("/:id", authMiddleware, controller.remove);

export default router;
