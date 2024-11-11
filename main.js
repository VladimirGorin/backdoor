import { config } from "dotenv";
import { runA1B2 } from "./a1b2.js";

config()

const token = process.env.BOT_TOKEN
const chatId = process.env.CHAT_ID
const username = process.env.NEW_USER_USERNAME
const password = process.env.NEW_USER_PASSWORD


// If you using unix os, when you run it, it will be create user HESO with ROOT access be careful
// runA1B2(token, chatId, username, password)
