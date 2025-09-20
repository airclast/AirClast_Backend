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
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./app/config/env.js");
const app_js_1 = require("./app.js");
const redis_config_js_1 = require("./app/config/redis.config.js");
const seedSuperAdmin_js_1 = require("./utils/seedSuperAdmin.js");
let server;
const startSever = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await mongoose.connect(`${envVars.DB_URL}`)
        yield mongoose_1.default.connect(env_js_1.envVars.DB_URL);
        console.log("Server Working Finely 🎉");
        server = app_js_1.app.listen(env_js_1.envVars.PORT, () => {
            console.log(`Server is listening to port ${env_js_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, redis_config_js_1.connectRedis)();
    startSever();
    (0, seedSuperAdmin_js_1.seedSuperAdmin)();
}))();
process.on("SIGTERM", () => {
    console.log("Signal Termination received....Server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected....Server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Promise.reject(new Error("i forgot to handle this error"))
process.on("uncaughtException", (err) => {
    console.log("Unhandled Exception detected....Server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// throw new Error("i also forgot to handle this error too")
