import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type ReceiptID = string;

export type Item = z.infer<typeof ItemSchema>;

export const ItemSchema = z.object({
  shortDescription: z
    .string()
    .regex(/^[\w\s-]+$/, "Invalid short description. Only letters, numbers, spaces, and hyphens are allowed.")
    .openapi({ example: "Mountain Dew 12PK" }),
  price: z
    .string()
    .regex(/^\d+\.\d{2}$/, "Invalid price format. Please enter a number with two decimal places (e.g., 10.99).")
    .transform(parseFloat)
    .openapi({ example: "6.49" }),
});

export type Receipt = z.infer<typeof ReceiptSchema>;

export const ReceiptSchema = z.object({
  retailer: z
    .string()
    .regex(/^[\w\s&-]+$/, "Invalid retailer name. Only letters, numbers, spaces, hyphens, and ampersands are allowed.")
    .openapi({ example: "M&M Corner Market" }),
  purchaseDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid purchase date format. Please enter the date in YYYY-MM-DD format (e.g., 2022-01-01).",
    )
    // assumes all date and time to be UTC
    .transform((d) => new Date(d))
    .openapi({ example: "2022-01-01" }),
  purchaseTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid purchase time format. Please enter the time in 24-hour format (e.g., 13:01).")
    .refine((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    })
    .transform((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return [hours, minutes] as const;
    })
    .openapi({ example: "13:01" }),
  items: z.array(ItemSchema).min(1),
  total: z
    .string()
    .regex(/^\d+\.\d{2}$/, "Invalid total amount format. Please enter a number with two decimal places (e.g., 6.49).")
    .transform(parseFloat)
    .openapi({ example: "6.49" }),
});
