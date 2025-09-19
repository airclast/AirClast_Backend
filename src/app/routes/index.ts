import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { OtpRoutes } from "../modules/otp/otp.route.js";

export const router = Router()

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path:"/otp",
        route:OtpRoutes
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
