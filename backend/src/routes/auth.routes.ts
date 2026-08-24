
import {Router} from "express"
import {loginUser, registerUser} from "../controllers/auth.controller.js"
import {authenticate} from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"

const router=Router()
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/profile",authenticate, authorize("Admin"), (req,res)=>{
    res.status(200).json({
        success:true,
         message: "You are authenticated as Admin"
    })
})
export default router;