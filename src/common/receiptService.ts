import { Receipt, ReceiptID } from "@/common/model";
import { v4 as uuid } from "uuid";

export interface IReceiptService {
  storeReceipt(receipt: Receipt): ReceiptID;
  getReceipt(id: ReceiptID): Receipt;
  calculatePoints(id: ReceiptID): number;
}

export type PointRule = (r: Receipt) => number;

export class ReceiptService implements IReceiptService {
  store: Record<ReceiptID, Receipt>;
  rules: PointRule[];

  constructor(rules: PointRule[]) {
    this.rules = rules;
    this.store = {};
  }

  getReceipt(id: ReceiptID): Receipt {
    if (id in this.store) {
      return this.store[id];
    }
    throw new Error("Receipt not found");
  }

  storeReceipt(receipt: Receipt): ReceiptID {
    const id = uuid();
    this.store[id] = receipt;
    return id;
  }

  calculatePoints(id: ReceiptID): number {
    const receipt = this.getReceipt(id);

    let points = 0;

    for (const rule of this.rules) {
      points += rule(receipt);
    }

    return points;
  }
}
