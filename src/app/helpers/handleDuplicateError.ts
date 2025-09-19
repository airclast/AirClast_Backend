
import httpStatus from "http-status-codes"
import { TGenericErrorResponse } from "../interfaces/error.type.js"

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
        const matchedArray = err.message.match(/"([^"]*)"/)

        return {
            statusCode: httpStatus.BAD_REQUEST,
            message: `${matchedArray[1]} already exists!!`
        }
    }