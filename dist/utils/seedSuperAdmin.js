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
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_js_1 = require("../app/modules/user/user.model.js");
const env_js_1 = require("../app/config/env.js");
const user_interface_js_1 = require("../app/modules/user/user.interface.js");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_js_1.User.findOne({ email: env_js_1.envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Super Admin...");
        const hashedPassword = yield bcryptjs_1.default.hash(env_js_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_js_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerId: env_js_1.envVars.SUPER_ADMIN_EMAIL
        };
        const payload = {
            name: "Super admin",
            role: user_interface_js_1.Role.SUPER_ADMIN,
            email: env_js_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        };
        const superAdmin = yield user_model_js_1.User.create(payload);
        console.log("Super Admin Created Successfully! \n");
        // console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
