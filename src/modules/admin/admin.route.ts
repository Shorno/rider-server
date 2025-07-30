import {Router} from "express";
import {adminSignup, getAllUsers, getAllDrivers, getAllRides} from "./admin.controller";
import {validateRequest} from "../../middlewares/validateRequest";
import {createAdminZodSchema} from "./admin.validation";
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "../../types/shared.types";

const router = Router()

router.post("/signup", validateRequest(createAdminZodSchema), adminSignup)
router.get("/users", checkAuth(Role.ADMIN), getAllUsers);
router.get("/drivers", checkAuth(Role.ADMIN), getAllDrivers);
router.get("/rides", checkAuth(Role.ADMIN), getAllRides);

export const AdminRoutes = router;
