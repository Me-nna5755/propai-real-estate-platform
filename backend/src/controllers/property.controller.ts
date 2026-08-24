
import { Request, Response } from "express";
import { Property } from "../models/property.model.js";
import { propertySchema } from "../validations/property.validation.js";
import { success } from "zod";



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
    const properties=await Property.find()
    return res.status(200).json({
        success:true,
        data:properties
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