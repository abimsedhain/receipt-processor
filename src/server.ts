import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { router as healthCheckRouter } from "@/api/healthCheck";
import { router as receiptsRouter } from "@/api/receipts";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/envConfig";
import { ReceiptService } from "./common/receiptService";
import { defaultRules } from "./common/rule";

const logger = pino({ name: "server start" });
const app: Express = express();
const receiptService = new ReceiptService(defaultRules());

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use((req, _res, next) => {
  req.receiptService = receiptService;
  next();
});

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/receipts", receiptsRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
