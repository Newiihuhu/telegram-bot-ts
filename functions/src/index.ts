import { onRequest } from "firebase-functions/v2/https";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { setupCommands } from "./commands/start";
import { setupActions } from "./actions/rent_update";
import { testCommands } from "./commands/test";
dotenv.config();

// ใช้ env หรือใส่ตรงนี้เลย (ไม่แนะนำใน production)
const bot = new Telegraf(process.env.BOT_TOKEN!);

setupCommands(bot);
testCommands(bot);
setupActions(bot);

// Handler Firebase Functions
export const telegramBot = onRequest(async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).send("OK");
});
