"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_js_1 = require("../app/config/env.js");
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: env_js_1.envVars.NODE_ENV === "development" ? false : true,
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: env_js_1.envVars.NODE_ENV === "development" ? false : true,
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
