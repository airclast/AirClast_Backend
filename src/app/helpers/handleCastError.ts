import mongoose from "mongoose"
import httpStatus from "http-status-codes"
import { TGenericErrorResponse } from "../interfaces/error.type.js"

export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Invalid Mongodb ObjectID, Please Provide a valid ID"
    }
}