import { Router } from "express";

import * as controller from "./product.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import authMiddleware from "../../middlewares/auth.Middleware.js";

const router = Router();

router.get("/", authMiddleware, controller.getAll);
router.get("/stats", authMiddleware, controller.getStats);
router.get("/:id", authMiddleware, controller.getById);
router.post("/", authMiddleware, upload.array("images", 5), controller.create);
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  controller.update,
);
router.patch("/:id/status", authMiddleware, controller.updateStatus);
router.delete("/:id", authMiddleware, controller.remove);

export default router;
