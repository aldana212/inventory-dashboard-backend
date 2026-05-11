import { Router } from "express";
import * as controller from './inventory.controller.js'
import authMiddleware from "../../middlewares/auth.Middleware.js";

const router = Router();

router.get("/:productId", authMiddleware, controller.getById);

export default router;
