import { onRequest } from "firebase-functions/v2/https";
import * as dotenv from "dotenv";
import { RegisterCommands } from "./controller/RegisterCommands";
import { setupUserMessage } from "./controller/RegisterUserMessage";
import { BotFactory } from "./platforms/BotFactory";

dotenv.config();

const bot = BotFactory.createBot("telegram", process.env.BOT_TOKEN!);

// Start the bot with polling
bot.start().catch(console.error);
RegisterCommands(bot);
setupUserMessage(bot);

// Remove webhook part since we're using polling
export const telegramBot = onRequest(async (req, res) => {
  try {
    console.log("req.body: " + req.body);
    await bot.handleWebhookUpdate(req.body);
    res.status(200).end();
  } catch (err) {
    console.error("Error handling update", err);
    res.status(500).end();
  }
});
