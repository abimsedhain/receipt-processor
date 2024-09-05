import * as PointCalculations from "../rule";
import { Receipt } from "../model";

let receipt: Receipt;

beforeAll(() => {
  receipt = {
    retailer: "M&M Corner Market",
    purchaseDate: new Date("2022-03-01"),
    purchaseTime: [14, 33],
    items: [
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
    ],
    total: 9.0,
  };
});

describe("Rules for Point Calculations", () => {
  it("should return total Alphanumeric count in the receipt", () => {
    expect(PointCalculations.calculateAlphanumericPoint(receipt)).toBe(14);
  });

  it("should return points for every Two Items", () => {
    expect(PointCalculations.calculateEveryTwoItemsPoint(receipt)).toBe(10);
  });

  it("should return total round dollar", () => {
    expect(PointCalculations.calculateRoundTotalPoint(receipt)).toBe(50);
  });

  it("should return multiple of 0.25", () => {
    expect(PointCalculations.calculateMultipleOfPoint(receipt)).toBe(25);
  });

  it("should tell if the date is odd or not", () => {
    expect(PointCalculations.calculateOddDayPoint(receipt)).toBe(6);
  });

  it("should tell if the item was purchased within 2 and 4", () => {
    expect(PointCalculations.calculateTwoToFourPoint(receipt)).toBe(10);
  });

  it("should return trimmed description point", () => {
    expect(PointCalculations.calculateTrimmedPoints(receipt)).toBe(0);
  });
});
