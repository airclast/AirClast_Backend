"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_js_1 = require("../modules/user/user.route.js");
const auth_route_js_1 = require("../modules/auth/auth.route.js");
const otp_route_js_1 = require("../modules/otp/otp.route.js");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_js_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_js_1.AuthRoutes
    },
    {
        path: "/otp",
        route: otp_route_js_1.OtpRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
