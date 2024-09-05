import { Receipt } from "./model";

export function calculateAlphanumericPoint(receipt: Receipt): number {
  return receipt.retailer.replace(/[^a-z0-9]/gi, "").length;
}

export function calculateEveryTwoItemsPoint(receipt: Receipt): number {
  return Math.floor(receipt.items.length / 2) * 5;
}

export function calculateRoundTotalPoint(receipt: Receipt): number {
  return receipt.total % 1 === 0 ? 50 : 0;
}

export function calculateMultipleOfPoint(receipt: Receipt): number {
  return receipt.total % 0.25 === 0 ? 25 : 0;
}

export function calculateOddDayPoint(receipt: Receipt): number {
  const dayOfMonth = receipt.purchaseDate.getUTCDate();
  return dayOfMonth % 2 !== 0 ? 6 : 0;
}

export function calculateTwoToFourPoint(receipt: Receipt): number {
  const [hours, minutes] = receipt.purchaseTime;
  const timeInMinutes = hours * 60 + minutes;
  const startTime = 14 * 60;
  const endTime = 16 * 60;
  return timeInMinutes >= startTime && timeInMinutes <= endTime ? 10 : 0;
}

export function calculateTrimmedPoints(receipt: Receipt): number {
  return receipt.items.reduce((total, item) => {
    const trimmedDescription = item.shortDescription.trim();
    return total + (trimmedDescription.length % 3 === 0 ? Math.ceil(item.price * 0.2) : 0);
  }, 0);
}

export function defaultRules() {
  return [
    calculateAlphanumericPoint,
    calculateEveryTwoItemsPoint,
    calculateRoundTotalPoint,
    calculateMultipleOfPoint,
    calculateOddDayPoint,
    calculateTwoToFourPoint,
    calculateTrimmedPoints,
  ];
}
