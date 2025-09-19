import crypto from "crypto"
import { StatusCodes } from "http-status-codes"
import { User } from "../user/user.model.js"
import AppError from "../../errorHelpers/AppError.js"
import { redisClient } from "../../config/redis.config.js"
import { sendEmail } from "../../../utils/sendEmail.js"


const OTP_EXPIRATION = 2 * 60

const generateOtp = (length = 6) => {
    // 6 Digit OTP
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000

    return otp
}

const sendOTP = async (email: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    if (user.isVerified === true) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are already verified")
    }

    const otp = generateOtp()

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp
        }
    })

};

const verifyOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const redisKey = `otp:${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
        throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
    }

    await Promise.all([
        User.findOneAndUpdate({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])

};

export const OTPService = {
    sendOTP,
    verifyOTP
}