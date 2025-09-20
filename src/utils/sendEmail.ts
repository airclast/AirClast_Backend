import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
// import { fileURLToPath } from "url";
import { envVars } from "../app/config/env.js";
import AppError from "../app/errorHelpers/AppError.js";

// Recreate __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST,
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(
      __dirname,
      `emailTemplates/${templateName}.ejs`
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
  } catch (error: any) {
    console.log("email sending error", error.message);
    throw new AppError(401, "Email error");
  }
};
