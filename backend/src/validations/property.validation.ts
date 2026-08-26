
import {z} from 'zod'

export const propertySchema=z.object({
    title:z.string().min(1,"title is required").trim(),
    slug:z.string().min(1,"slug is required").trim(),
    description:z.string().trim().optional(),
    price:z.number().nonnegative("price cannot be negative"),
    purpose:z.enum(["Sale","Rent"]),
    type:z.string().min(1,"type is required").trim(),
    bedrooms:z.number().nonnegative("bedrooms cannot be negative").int("bedrooms must be an integer"),
    bathrooms:z.number().nonnegative("bathrooms connot be negative").optional(),
    area:z.number().nonnegative("area cannot be negative").optional(),
    address:z.string().min(1,"address is required").trim(),
    location:z.object({latitude:z.number(),longitude:z.number()}).required(),
    amenities:z.array(z.string()).optional(),
    images:z.array(z.string()).optional(),
    status:z.enum(["Draft", "Available","Reserved","Sold","Rented","Archived"]).optional(),
    agent:z.string().min(1,"agent is required"),
    metaTitle:z.string().trim().optional(),
    metaDescription:z.string().trim().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

})
export type CreatePropertyInput= z.infer<typeof propertySchema>