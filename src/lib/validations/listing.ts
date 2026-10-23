import { z } from "zod";

export const listingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title cannot exceed 120 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters description.")
    .max(5000, "Description cannot exceed 5000 characters."),
  priceInr: z.coerce
    .number()
    .int("Price must be a whole number.")
    .min(0, "Price cannot be negative.")
    .max(10000000, "Price is too high."),
  condition: z.enum(["like_new", "good", "fair"], {
    message: "Select a valid condition.",
  }),
  categoryId: z.string().uuid("Please select a category."),
  collegeId: z.string().uuid().optional().or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(2, "City name must be at least 2 characters.")
    .max(80),
});
