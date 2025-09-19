import { ZodError } from "zod";
import httpStatus from "http-status-codes"
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type.js";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorsSources: TErrorSources[] = []
    JSON.parse(err?.message).forEach((issue: any) => {
        errorsSources.push({
            // path: issue.path[issue.path.length - 1],
            path: issue.path.length > 1 ? issue.path.reverse().join(" inside ") : issue.path[0],
            message: issue.message.split(": ")[1]
        })
    });
    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Zod Error",
        errorsSources
    }
}