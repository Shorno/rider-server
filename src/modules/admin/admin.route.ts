import {Router} from "express";
import {
    adminSignup,
    getAllUsers,
    getAllDrivers,
    getAllRides,
    updateDriverStatus,
    updateUserStatus
} from "./admin.controller";
import {validateRequest} from "../../middlewares/validateRequest";
import {createAdminZodSchema, updateDriverStatusSchema, updateUserStatusSchema} from "./admin.validation";
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "../../types/shared.types";

const router = Router()

router.post("/signup", validateRequest(createAdminZodSchema), adminSignup)
router.get("/users", checkAuth(Role.ADMIN), getAllUsers);
router.patch("/users/:userId/status", checkAuth(Role.ADMIN), validateRequest(updateUserStatusSchema), updateUserStatus)
router.get("/drivers", checkAuth(Role.ADMIN), getAllDrivers);
router.patch("/drivers/:driverId/status", validateRequest(updateDriverStatusSchema), checkAuth(Role.ADMIN), updateDriverStatus)
router.get("/rides", checkAuth(Role.ADMIN), getAllRides);

export const AdminRoutes = router;
