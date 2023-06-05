import * as dotenv from "dotenv";
dotenv.config();

export const SERVER_URL = process.env.SERVER_URL || "http://localhost";
export const PORT = process.env.PORT || 8080;
export const DB_HOST =
  process.env.DB_HOST || "mongodb://localhost:27017/ecommerce";
export const DB_AUTO_INDEX = Boolean(process.env.DB_AUTO_INDEX) || false;
export const DB_BUFFER_COMMANDS =
  Boolean(process.env.DB_BUFFER_COMMANDS) || false;
export const DB_OPTIONS = {
  autoIndex: DB_AUTO_INDEX,
  bufferCommands: DB_BUFFER_COMMANDS,
};
export const ADMIN_USER = process.env.ADMIN_USER || "admin@admin.com";
export const ADMIN_PASS = process.env.ADMIN_PASS || "admin";
export const SESSION_SECRET = process.env.SESSION_SECRET || "secretCoder";
export const CLIENT_ID = process.env.CLIENT_ID || "";
export const CLIENT_PASS = process.env.CLIENT_PASS || "";
export const CB_URL = process.env.CB_URL || "";
export const GMAIL_MAIL_USER = process.env.GMAIL_MAIL_USER || "";
export const GMAIL_PASS = process.env.GMAIL_PASS || "";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
export const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER || "";