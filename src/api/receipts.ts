import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router, type Response, type Request } from "express";
import { z, ZodError } from "zod";

import { Receipt, ReceiptSchema } from "../common/model";
import { StatusCodes } from "http-status-codes";

export const registry = new OpenAPIRegistry();
export const router: Router = express.Router();

registry.register("Receipt", ReceiptSchema);

registry.registerPath({
  tags: ["Receipts"],
  method: "get",
  path: "/receipts/{id}/points",
  summary: "Returns the points awarded for the receipt",
  description: "Returns the points awarded for the receipt",
  request: {
    params: z.object({ id: z.string().regex(/^\S+$/) }),
  },
  responses: {
    [StatusCodes.OK]: {
      description: "The number of points awarded",
      content: {
        "application/json": {
          schema: z.object({
            points: z.number().openapi({ type: "integer", format: "int64", example: 100 }),
          }),
        },
      },
    },
    [StatusCodes.NOT_FOUND]: {
      description: "No receipt found for that id",
    },
  },
});

router.get("/:id/points", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const points = req.receiptService.calculatePoints(id);
    res.status(200).json({ totalPoints: points });
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

registry.registerPath({
  tags: ["Receipts"],
  method: "post",
  path: "/receipts/process",
  summary: "Submits a receipt for processing",
  description: "Submits a receipt for processing",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: ReceiptSchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description: "Returns the ID assigned to the receipt",
      content: {
        "application/json": {
          schema: z.object({
            id: z.string().regex(/^\S+$/).openapi({ example: "adb6b560-0eef-42bc-9d16-df48f30e89b2" }),
          }),
        },
      },
    },
    [StatusCodes.BAD_REQUEST]: {
      description: "The receipt is invalid",
    },
  },
});

router.post("/process", async (req: Request, res: Response) => {
  let receipt: Receipt;
  try {
    receipt = ReceiptSchema.parse(req.body);
  } catch (err) {
    err as ZodError;
    res.status(StatusCodes.BAD_REQUEST).json(err);
    return;
  }

  const id = req.receiptService.storeReceipt(receipt);

  res.status(StatusCodes.OK).json({ id: id });
});
