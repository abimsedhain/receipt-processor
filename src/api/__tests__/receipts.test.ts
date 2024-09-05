import express from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { router } from "@/api/receipts";
import { app } from "../../server";

describe("Request Testing", () => {
  let id: string;
  app.use(express.json());
  app.use("/receipts", router);

  //Tests for POST requests

  //Successful POST requests
  describe("Successful POST request", () => {
    it("should create a new receipt and return an ID", async () => {
      const response = await request(app)
        .post("/receipts/process")
        .send({
          retailer: "Target",
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: "6.49",
            },
            {
              shortDescription: "Emils Cheese Pizza",
              price: "12.25",
            },
            {
              shortDescription: "Knorr Creamy Chicken",
              price: "1.26",
            },
            {
              shortDescription: "Doritos Nacho Cheese",
              price: "3.35",
            },
            {
              shortDescription: "Klarbrunn 12-PK 12 FL OZ",
              price: "12.00",
            },
          ],
          total: "35.35",
        });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("id");

      //Set id for GET Request
      id = response.body.id;
    });
  });

  //Unsuccessful POST requests
  describe("Unsuccesful POST request", () => {
    it("should return 400 if the body is missing values", async () => {
      const response = await request(app)
        .post("/receipts/process")
        .send({
          retailer: "Target", // Missing required fields like purchaseDate, purchaseTime, etc.
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: "6.49",
            },
          ],
          total: "6.49",
        });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 422 if a number is passed instead of a string for 'retailer' ", async () => {
      const response = await request(app)
        .post("/receipts/process")
        .send({
          retailer: 1234, // Invalid input: number instead of string
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: "6.49",
            },
            {
              shortDescription: "Emils Cheese Pizza",
              price: "12.25",
            },
          ],
          total: "18.74",
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 422 if price is a number instead a string", async () => {
      const response = await request(app)
        .post("/receipts/process")
        .send({
          retailer: "Target",
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: 6.49,
            },
            {
              shortDescription: "Emils Cheese Pizza",
              price: "12.25",
            },
          ],
          total: "18.74",
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 422 if 'purchaseDate' is in incorrect format", async () => {
      const response = await request(app)
        .post("/receipts/process")
        .send({
          retailer: "Target",
          purchaseDate: "01-01-2022",
          purchaseTime: "13:01",
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: "6.49",
            },
            {
              shortDescription: "Emils Cheese Pizza",
              price: "12.25",
            },
          ],
          total: "18.74",
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  //GET Request
  //Successful GET requests
  describe("Successful ID retrival", () => {
    it("should return a total points", async () => {
      const response = await request(app).get(`/receipts/${id}/points`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("totalPoints");
      expect(typeof response.body.totalPoints).toBe("number");
    });
  });

  //Unsuccessful GET requests
  describe("Non-existent ID", () => {
    it("should return 404 for non-existent receipt ID", async () => {
      const response = await request(app).get(`/receipts/invalid-id/points`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
