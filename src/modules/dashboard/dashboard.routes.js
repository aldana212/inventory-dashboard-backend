import { Router } from "express";

import * as controller from "./dashboard.controller.js";
import authMiddleware from "../../middlewares/auth.Middleware.js";

const router = Router();

// router.get("/stats", authMiddleware, controller.getStats);
// router.get("/stats/bar", authMiddleware, controller.getBarChartStats);
// router.get("/categories/popular", authMiddleware, controller.getBarChartStats);

// 📊 KPIs generales
router.get(
  "/analytics/summary",
  authMiddleware,
  controller.getSummary
);

// 📊 Bar chart (movimientos por día/mes)
router.get(
  "/analytics/movements/bar",
  authMiddleware,
  controller.getMovementsBar
);

// 📊 Pie (tu gráfico actual)
router.get(
  "/analytics/categories/popular",
  authMiddleware,
  controller.getPopularCategories
);



export default router;
