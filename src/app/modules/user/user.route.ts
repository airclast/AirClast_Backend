import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation.js";
import { UserControllers } from "./user.controller.js";
import { Role } from "./user.interface.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)

router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getSingleUser)

router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const UserRoutes = router