import {Router} from "express";
import {validateRequest} from "../../middlewares/validateRequest";
import {createDriverZodSchema, updateDriverAvailabilitySchema} from "./driver.validation";
import {createDriver, updateDriverAvailability} from "./driver.controller";
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "../../types/shared.types";

const router = Router()

router.use((req, res, next) => {
    console.log(`Driver route hit: ${req.method} ${req.path}`);
    next();
});

router.post("/signup", validateRequest(createDriverZodSchema), createDriver)
router.patch("/availability", validateRequest(updateDriverAvailabilitySchema), checkAuth(Role.DRIVER), updateDriverAvailability)

export const DriverRoutes = router;
