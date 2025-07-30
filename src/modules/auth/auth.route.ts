import {Router} from "express";
import {credentialsLogin, getNewAccessToken, logout, resetPassword} from "./auth.controller";
import {checkAuth} from "../../middlewares/checkAuth";
import {Role} from "../../types/shared.types";

const router = Router()

router.post("/login", credentialsLogin)
router.post("/refresh-token", getNewAccessToken)
router.post("/logout", logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), resetPassword)

export const AuthRoutes = router;