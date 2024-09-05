import express from "express";
import { ReceiptService, IReceiptService, PointRule } from "../receiptService";
import { Receipt } from "../model";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../server";

describe("ReceiptService", () => {
  let receiptService: IReceiptService;
  let sampleReceipt: Receipt;

  beforeEach(() => {
    const sampleRule: PointRule = (receipt: Receipt) => Math.floor((receipt.items.length / 2) * 5);

    receiptService = new ReceiptService([sampleRule]);

    sampleReceipt = {
      retailer: "M&M Corner Market",
      purchaseDate: new Date("2022-01-01"),
      purchaseTime: [13, 1],
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: 6.49,
        },
      ],
      total: 6.49,
    };
  });

  it("should get a stored receipt by ID", () => {
    const receiptId = receiptService.storeReceipt(sampleReceipt);
    const retrievedReceipt = receiptService.getReceipt(receiptId);
    expect(retrievedReceipt).toEqual(sampleReceipt);
  });

  it("should throw an error when trying to get a non-existent receipt", () => {
    const invalidReceiptId = "invalid-id";
    const getReceiptAction = () => receiptService.getReceipt(invalidReceiptId);
    expect(getReceiptAction).toThrow("Receipt not found");
  });

  it("should calculate points correctly based on rules", () => {
    const receiptId = receiptService.storeReceipt(sampleReceipt);
    const points = receiptService.calculatePoints(receiptId);
    expect(points).toBe(2);
  });

  it("should throw an error when trying to calculate points for a non-existent receipt", () => {
    const invalidReceiptId = "invalid-id";
    const calculatePointsAction = () => receiptService.calculatePoints(invalidReceiptId);
    expect(calculatePointsAction).toThrow("Receipt not found");
  });
});
