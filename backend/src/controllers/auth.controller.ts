
import { Request,Response } from "express";
import bcrypt from "bcryptjs"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const registerUser=async(req:Request,res:Response)=>{
    const { fullName, email, password} = req.body
    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists"})
    }
    const hashedPassword =await bcrypt.hash(password,10)
    const user= await User.create({
        fullName,
        email,
        password:hashedPassword
        
    })
    return res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
           
        }
    })
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
    {
        id: user._id.toString(),
        role: user.role
    },
    process.env.JWT_SECRET!,
    {
        expiresIn: "7d"
    }
);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token
    });
};