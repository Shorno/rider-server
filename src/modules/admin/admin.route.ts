import {Router} from "express";
import {adminSignup} from "./admin.controller";
import {validateRequest} from "../../middlewares/validateRequest";
import {createAdminZodSchema} from "./admin.validation";

const router = Router()

router.post("/signup", validateRequest(createAdminZodSchema), adminSignup)

export const AdminRoutes = router;
