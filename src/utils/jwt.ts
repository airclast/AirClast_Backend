import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import AppError from "../app/errorHelpers/AppError";
import { envVars } from "../app/config/env";

export const generateJwtToken = (payload: JwtPayload, secret: jwt.Secret | jwt.PrivateKey, expiresIn: string = envVars.JWT_ACCESS_EXPIRES) => {
    const accessToken = jwt.sign(payload, secret, {
        expiresIn,
        algorithm: "HS512"
    } as SignOptions)

    return accessToken
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error: any) {
        console.log("JWT ERROR:", error.name, error.message);

        if (error.name === "TokenExpiredError") {
            throw new AppError(401, "Token expired. Please get new one");
        }
        if (error.name === "JsonWebTokenError") {
            throw new AppError(401, "Invalid token. Please get new one");
        }
        throw new AppError(401, "Unauthorized access");
    }
};
