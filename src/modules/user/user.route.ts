import {Router} from "express";
import {validateRequest} from "../../middlewares/validateRequest";
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "./user.interface";
import {createUserZodSchema} from "./user.validation";
import {createUser, updateUser} from "./user.controller";


const router = Router()

router.use((req, res, next) => {
    console.log(`User route hit: ${req.method} ${req.path}`);
    next();
});

router.post("/signup", validateRequest(createUserZodSchema), createUser)
router.patch("/:userId", checkAuth(...Object.values(Role)), updateUser)


export const UserRoutes = router;