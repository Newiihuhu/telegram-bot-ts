import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
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
export const telegramBot = onRequest(async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).send("OK");
});

// ฟังก์ชันสำหรับส่งการแจ้งเตือนทันที
export const sendNotification = onRequest(async (req, res) => {
  try {
    // ส่งข้อความแจ้งเตือนไปยังแชทที่กำหนด
    await bot.telegram.sendMessage(
      process.env.CHAT_ID!, // ต้องกำหนด CHAT_ID ใน .env
      "สวัสดีครับ/ค่ะ! นี่คือการแจ้งเตือนจาก Bot 🤖"
    );
    console.log("ส่งการแจ้งเตือนสำเร็จ");
    res.status(200).send("ส่งการแจ้งเตือนสำเร็จ");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการส่งการแจ้งเตือน:", error);
    res.status(500).send("เกิดข้อผิดพลาดในการส่งการแจ้งเตือน");
  }
});

// ฟังก์ชันสำหรับส่งการแจ้งเตือนรายวัน
export const dailyNotification1835 = onSchedule(
  { schedule: "35 18 * * *", timeZone: "Asia/Bangkok" },
  async (event) => {
    try {
      await bot.telegram.sendMessage(
        process.env.CHAT_ID!,
        "⏰ แจ้งเตือนเวลา 18:35 น. ครับ/ค่ะ! 🎯"
      );
      console.log("ส่งการแจ้งเตือน 18:35 สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งการแจ้งเตือน 18:35:", error);
    }
  }
);

export const dailyNotification1840 = onSchedule(
  { schedule: "40 18 * * *", timeZone: "Asia/Bangkok" },
  async (event) => {
    try {
      await bot.telegram.sendMessage(
        process.env.CHAT_ID!,
        "⏰ แจ้งเตือนเวลา 18:40 น. ครับ/ค่ะ! 🎯"
      );
      console.log("ส่งการแจ้งเตือน 18:40 สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งการแจ้งเตือน 18:40:", error);
    }
  }
);

export const dailyNotification1842 = onSchedule(
  { schedule: "42 18 * * *", timeZone: "Asia/Bangkok" },
  async (event) => {
    try {
      await bot.telegram.sendMessage(
        process.env.CHAT_ID!,
        "⏰ แจ้งเตือนเวลา 18:42 น. ครับ/ค่ะ! 🎯"
      );
      console.log("ส่งการแจ้งเตือน 18:42 สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งการแจ้งเตือน 18:42:", error);
    }
  }
);
