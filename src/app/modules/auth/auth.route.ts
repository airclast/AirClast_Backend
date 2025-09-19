import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller.js";
import { Role } from "../user/user.interface.js";
import { envVars } from "../../config/env.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword)
router.post("/forgot-password", AuthControllers.forgotPassword)


// Google OAuth Related APIs Routes
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthControllers.googleCallbackControl)

export const AuthRoutes = router