"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserTokens = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_js_1 = require("../app/config/env.js");
const user_model_js_1 = require("../app/modules/user/user.model.js");
const AppError_js_1 = __importDefault(require("../app/errorHelpers/AppError.js"));
const user_interface_js_1 = require("../app/modules/user/user.interface.js");
const jwt_js_1 = require("./jwt.js");
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_js_1.generateJwtToken)(jwtPayload, env_js_1.envVars.JWT_ACCESS_SECRET, env_js_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_js_1.generateJwtToken)(jwtPayload, env_js_1.envVars.JWT_REFRESH_SECRET, env_js_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserTokens = createUserTokens;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_js_1.verifyToken)(refreshToken, env_js_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = yield user_model_js_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_js_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not Exist");
    }
    if (isUserExist.isActive === user_interface_js_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_js_1.IsActive.INACTIVE) {
        throw new AppError_js_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive.toLowerCase()}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_js_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_js_1.generateJwtToken)(jwtPayload, env_js_1.envVars.JWT_ACCESS_SECRET, env_js_1.envVars.JWT_ACCESS_EXPIRES);
    return {
        accessToken
    };
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
