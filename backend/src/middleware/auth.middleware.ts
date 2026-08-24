
import {Request,Response,NextFunction} from "express"
import jwt,{JwtPayload} from "jsonwebtoken"

export const authenticate=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            success:false,
            message:"Authorization token required"
        })
    }

    const token=authHeader.split(" ")[1];
    if(!token){
  return res.status(401).json({
    success:false,
    message:"Invalid authorization format"
  })
}
try{
   const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!,
) as JwtPayload & {
    id: string;
    role: string;
};

req.user = {
    id: decoded.id,
    role: decoded.role,
};
    
    next()
}catch(err){
    return res.status(401).json({
        success:false,
        message:"Invalid or expired token"
    })
}

}