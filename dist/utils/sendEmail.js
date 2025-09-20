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
exports.sendEmail = void 0;
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
// import { fileURLToPath } from "url";
const env_js_1 = require("../app/config/env.js");
const AppError_js_1 = __importDefault(require("../app/errorHelpers/AppError.js"));
// Recreate __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const transporter = nodemailer_1.default.createTransport({
    secure: true,
    auth: {
        user: env_js_1.envVars.EMAIL_SENDER.SMTP_USER,
        pass: env_js_1.envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(env_js_1.envVars.EMAIL_SENDER.SMTP_PORT),
    host: env_js_1.envVars.EMAIL_SENDER.SMTP_HOST,
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateData, attachments, }) {
    try {
        const templatePath = path_1.default.join(__dirname, `emailTemplates/${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(templatePath, templateData);
        const info = yield transporter.sendMail({
            from: env_js_1.envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    }
    catch (error) {
        console.log("email sending error", error.message);
        throw new AppError_js_1.default(401, "Email error");
    }
});
exports.sendEmail = sendEmail;
