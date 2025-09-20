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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport");
const index_js_1 = require("./app/routes/index.js");
const globalErrorHandler_js_1 = require("./app/middlewares/globalErrorHandler.js");
const notFound_js_1 = require("./app/middlewares/notFound.js");
exports.app = (0, express_1.default)();
// Passport JS Initialization Middlewares
exports.app.use((0, express_session_1.default)({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false
}));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
// Necessary Middleware
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use((0, cors_1.default)({
    origin: [],
    credentials: true
}));
exports.app.use("/api/v1", index_js_1.router);
exports.app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: "Welcome to Air Guard System Backend"
    });
}));
exports.app.use(globalErrorHandler_js_1.globalErrorHandler);
exports.app.use(notFound_js_1.notFound);
