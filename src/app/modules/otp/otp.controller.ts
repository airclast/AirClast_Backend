import { Request, Response } from "express";
import { OTPService } from "./otp.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";


const sendOTP = catchAsync(async (req: Request, res: Response) => {

    const { email } = req.body

    await OTPService.sendOTP(email)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Sent Successfully",
        data: null,
    });
})

const verifyOTP = catchAsync(async (req: Request, res: Response) => {

    const { email, otp } = req.body

    await OTPService.verifyOTP(email, otp)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Verified Successfully",
        data: null,
    });
})

export const OTPController = {
    sendOTP,
    verifyOTP
};