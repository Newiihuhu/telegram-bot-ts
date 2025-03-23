import * as functions from "firebase-functions";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
dotenv.config();

// ใช้ env หรือใส่ตรงนี้เลย (ไม่แนะนำใน production)
const bot = new Telegraf(process.env.BOT_TOKEN!);

// ตอบกลับเมื่อมีคนพิมพ์ "/start"
bot.start((ctx) => {
  ctx.reply("สวัสดี! Bot นี้ทำงานแล้วบน Firebase Functions 🎉");
});

// ตัวอย่าง: ตอบกลับเมื่อมีข้อความทั่วไป
bot.on("text", (ctx) => {
  ctx.reply(`คุณพิมพ์ว่า: ${ctx.message.text}`);
});

// Handler สำหรับ Firebase Functions
export const telegramBot = functions.https.onRequest(async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).send("OK");
});
