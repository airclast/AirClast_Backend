import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../../utils/catchAsync.js";
import { UserServices } from "./user.service.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { IUser } from "./user.interface.js";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body)

    sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        message: "Account Create Successfully",
        success: true,
        data: result
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token!, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const payload = req.body
    const verifiedToken = req.user

    const result = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Profile Update Successfully",
        success: true,
        data: result
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await UserServices.getAllUsers(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload

    const result = await UserServices.getMe(decodedToken.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id

    const result = await UserServices.getSingleUser(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

export const UserControllers = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    getSingleUser
}