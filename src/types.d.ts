import * as express from "express";
import { type IReceiptService } from "./common/receiptService";

declare global {
  namespace Express {
    interface Request {
      receiptService: IReceiptService;
    }
  }
}
