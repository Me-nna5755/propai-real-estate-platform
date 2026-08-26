
import { Request, Response } from "express";
import { Property } from "../models/property.model.js";
import { propertyQuerySchema } from "../validations/property-query.validation.js";
import { propertySchema } from "../validations/property.validation.js";




export const createProperty = async (req: Request,  res: Response) => {
  const {
    title ,slug,description,price, purpose, type, bedrooms, bathrooms,area,address,location,amenities,images,status,metaTitle,metaDescription  
} =req.body

const validationResult =propertySchema.safeParse({
    title ,slug,description,price, purpose, type, bedrooms, bathrooms,area,address,location,amenities,images,status,
    agent:req.user?.id,
    metaTitle,metaDescription  
})
if(!validationResult.success){
    return res.status(400).json({
        success:false,
        message:"Validation failed",
        errors:validationResult.error.issues
    })
}
const validatedData = validationResult.data;

const property = await Property.create(validatedData);
res.status(201).json({
    success:true,
    message:"Property created successfully",
    data:property
});
};



export const getProperties= async(req:Request,res:Response)=>{
    const validationResult= propertyQuerySchema.safeParse(req.query)
    if (!validationResult.success) {
    return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: validationResult.error.issues
    });
}
const { location,purpose,type,bedrooms,bathrooms,areaMin,areaMax,priceMin,priceMax,search,sort,page,limit} 
= validationResult.data;
const currentPage = page ?? 1;
const itemsPerPage = limit ?? 10;
const skip = (currentPage - 1) * itemsPerPage;

const filter: any = {};
if (purpose) {
    filter.purpose = purpose;
}
if (type) {
    filter.type = type;
}
if (location) {
    filter.address = {
        $regex: location,
        $options: "i"
    };
}
if (bedrooms !== undefined) {
    filter.bedrooms = bedrooms;
}
if (bathrooms !== undefined) {
    filter.bathrooms = bathrooms;
}
if (priceMin !== undefined) {
    filter.price = {
        ...filter.price,
        $gte: priceMin
    };
}
if (priceMax !== undefined) {
    filter.price = {
        ...filter.price,
        $lte: priceMax
    };
}
if (areaMin !== undefined) {
    filter.area = {
        ...filter.area,
        $gte: areaMin
    };
}

if (areaMax !== undefined) {
    filter.area = {
        ...filter.area,
        $lte: areaMax
    };
}
if (search) {
    filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
    ];
}
let sortOption: any = {};
if (sort === "price_asc") {
    sortOption.price = 1;
}
if (sort === "price_desc") {
    sortOption.price = -1;
}
if (sort === "newest") {
    sortOption.createdAt = -1;
}
if (sort === "oldest") {
    sortOption.createdAt = 1;
}
const totalProperties = await Property.countDocuments(filter);
const totalPages = Math.ceil(totalProperties / itemsPerPage);
if (currentPage > totalPages && totalProperties > 0) {
    return res.status(404).json({
        success: false,
        message: "Page not found"
    });
}


  const properties = await Property
    .find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(itemsPerPage);


    if (totalProperties === 0) {
    return res.status(200).json({
        success: true,
        message: "No properties found",
        data: []
    });
}



    return res.status(200).json({
        success:true,
        data:{
            properties,
            page: currentPage,
            totalPages,
            totalProperties
        }
    })
}


export const getPropertyId =async(req:Request,res:Response)=>{
    const {id}=req.params
    const property= await Property.findById(id)
    if (!property) {
        return res.status(404).json({
            success:false,
            message:"Property not found"
        })
    }
    return res.status(200).json({
           success:true,
            message: "Property retrieved successfully",
            data:property
    })
}


export const updateProperty = async ( req: Request,res: Response) => {
const { id } = req.params;
const property = await Property.findById(id);
if (!property) {
    return res.status(404).json({
        success:false,
        message:"property not found"
    })
}
const user=req.user;
if(!user){
    return res.status(401).json({
        success:false,
         message: "Unauthorized"
    })
}
if (
    user.role !== "Admin" && property.agent.toString()!==user.id
) {
    return res.status(403).json({
        success:false,
        message: "You do not have permission to update this property"
    })
}

const { title,  slug,  description, price,  purpose,   type,  bedrooms, bathrooms, area, address, location, amenities, images, status, metaTitle, metaDescription
} = req.body;
const validationResult = propertySchema.safeParse({
    title, slug, description, price, purpose,type,bedrooms, bathrooms, area, address, location, amenities, images,  status,agent: user.id,metaTitle, metaDescription
});
if(!validationResult.success){
    return res.status(400).json({
        success:false,
        message:"Validation failed",
        errors:validationResult.error.issues
    })
}
const validatedData=validationResult.data
Object.assign(property,validatedData)
await property.save()


return res.status(200).json({
    success: true,
    message: "Property updated successfully",
    data: property
});

};


export const  deleteProperty = async (req: Request, res: Response) => {
     let {id}=req.params
     const property =await  Property.findById(id)
     if (!property) {
        return res.status(404).json({
            success:false,
            message:"Property  not found"
        })
        
     }
     const user = req.user;

if (!user) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized"
    });
}

if (
    user.role !== "Admin" &&
    property.agent.toString() !== user.id
) {
    return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this property"
    });
} 
 await property.deleteOne()
return res.status(200).json({
    success:true,
    message:"Property deleted successfully"
})

};