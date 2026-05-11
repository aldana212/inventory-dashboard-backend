import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import companyRoutes from "./modules/company/company.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import MeasurementUnitRoutes from "./modules/MeasurementUnit/measurementUnit.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import movementRoutes from "./modules/movement/movement.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// rutas
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/MeasurementUnit", MeasurementUnitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/movement", movementRoutes);
app.use("/api/inventory", inventoryRoutes);


// middleware de errores
app.use(errorMiddleware);

export default app;
