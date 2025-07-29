import {Router} from "express";
import {validateRequest} from "../../middlewares/validateRequest";
import {createDriverZodSchema} from "./driver.validation";
import {createDriver, getAllDrivers} from "./driver.controller";

const router = Router()

router.use((req, res, next) => {
    console.log(`Driver route hit: ${req.method} ${req.path}`);
    next();
});

router.post("/signup", validateRequest(createDriverZodSchema), createDriver)
router.get("/", getAllDrivers)

export const DriverRoutes = router;
