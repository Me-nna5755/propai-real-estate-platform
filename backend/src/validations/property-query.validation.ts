
import { z } from "zod";

export const propertyQuerySchema = z.object({
    location: z.string().trim().optional(),
    purpose: z.enum(["Sale", "Rent"]).optional(),
    type: z.string().trim().optional(),
   bedrooms: z.coerce.number().int().nonnegative().optional(),
   bathrooms: z.coerce.number().nonnegative().optional(),
   areaMin: z.coerce.number().nonnegative().optional(),
   areaMax: z.coerce.number().nonnegative().optional(),
   priceMin: z.coerce.number().nonnegative().optional(),
   priceMax: z.coerce.number().nonnegative().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort: z.enum([ "price_asc",  "price_desc",  "newest",  "oldest" ]).optional(),

  
});