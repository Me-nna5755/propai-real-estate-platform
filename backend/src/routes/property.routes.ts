
import {Router} from 'express'
import {createProperty ,getProperties,getPropertyId,updateProperty,deleteProperty }from "../controllers/property.controller.js"
import {authenticate} from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"



const router = Router();

router.post("/",authenticate,authorize("Agent","Admin"),createProperty)
router.get("/", getProperties)
router.get("/:id",getPropertyId)
router.put("/:id",authenticate,authorize("Agent","Admin"),updateProperty)
router.delete("/:id",authenticate,authorize("Agent","Admin"),deleteProperty)


export default router;