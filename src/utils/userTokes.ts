import { JwtPayload } from "jsonwebtoken";
import { generateJwtToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes"
import { envVars } from "../app/config/env";
import { User } from "../app/modules/user/user.model";
import AppError from "../app/errorHelpers/AppError";
import { IsActive, IUser } from "../app/modules/user/user.interface";

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    }

    const accessToken = generateJwtToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateJwtToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive.toLowerCase()}`)
    }

    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    }

    const accessToken = generateJwtToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }
}