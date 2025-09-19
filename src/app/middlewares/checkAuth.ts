import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import AppError from "../errorHelpers/AppError.js"
import { verifyToken } from "../../utils/jwt.js"
import { envVars } from "../config/env.js"
import { User } from "../modules/user/user.model.js"
import { IsActive } from "../modules/user/user.interface.js"

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(httpStatus.NOT_FOUND, "Access Token Not Received Yet!")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive.toLowerCase()}`)
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to view this route data!")
        }

        req.user = verifiedToken
 
        next()
    }
    catch (error: any) {
        next(error)
    }
}