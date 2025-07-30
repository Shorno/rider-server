import {Router} from "express";
import {validateQuery, validateRequest} from "../../middlewares/validateRequest";
import {createDriverZodSchema, updateDriverAvailabilitySchema, getEarningsHistorySchema} from "./driver.validation";
import {createDriver, updateDriverAvailability, getDriverEarningsHistory} from "./driver.controller";
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "../../types/shared.types";

const router = Router()

router.use((req, res, next) => {
    console.log(`Driver route hit: ${req.method} ${req.path}`);
    next();
});

router.post("/signup", validateRequest(createDriverZodSchema), createDriver)
router.patch("/availability", validateRequest(updateDriverAvailabilitySchema), checkAuth(Role.DRIVER), updateDriverAvailability)
router.get("/earnings/history", validateQuery(getEarningsHistorySchema), checkAuth(Role.DRIVER), getDriverEarningsHistory)

export const DriverRoutes = router;
