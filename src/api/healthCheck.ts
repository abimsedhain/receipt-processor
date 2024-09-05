import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";

import { StatusCodes } from "http-status-codes";

export const registry = new OpenAPIRegistry();
export const router: Router = express.Router();

registry.registerPath({
  method: "get",
  path: "/health-check",
  tags: ["Health Check"],
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description: "Service is healthy",
    },
  },
});

router.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.NO_CONTENT).end();
  return;
});
