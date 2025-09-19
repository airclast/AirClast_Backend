import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import passport from "passport"
import { catchAsync } from "../../../utils/catchAsync.js"
import AppError from "../../errorHelpers/AppError.js"
import { createUserTokens } from "../../../utils/userTokes.js"
import { setAuthCookie } from "../../../utils/setCookie.js"
import { sendResponse } from "../../../utils/sendResponse.js"
import { AuthServices } from "./auth.service.js"
import { clearCookie } from "../../../utils/clearCookie.js"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env.js"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(httpStatus.UNAUTHORIZED, err))
        }

        if (!user) {
            return next(new AppError(httpStatus.UNAUTHORIZED, info.message))
        }

        const userTokens = createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()

        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            },
        })
    })(req, res, next)
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken as string

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Received From Cookies")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false,
    // })

    setAuthCookie(res, { accessToken: tokenInfo.accessToken })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    clearCookie(res, "accessToken")
    clearCookie(res, "refreshToken")

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logout Successfully",
        data: null
    })
})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload

    const newPasswordFromBody = req.body.newPassword
    const oldPasswordFromBody = req.body.oldPassword

    await AuthServices.changePassword(oldPasswordFromBody, newPasswordFromBody, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Updated Successfully",
        data: null
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Reset Successfully",
        data: null,
    })
})

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload

    const plainPassword = req.body.plainPassword

    const result = await AuthServices.setPassword(decodedToken, plainPassword)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Set Successfully",
        data: null
    })
})

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})

const googleCallbackControl = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user

    // console.log("User From OAuth", user)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword,
    googleCallbackControl
}