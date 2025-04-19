import { onRequest } from "firebase-functions/v2/https";
import { session, Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { setupActions } from "./actions/rent_update";
import { setupAllCommands } from "./commands/all_commands";
import { BotContext } from "./models/session_data";
import { setupUserMessage } from "./actions/user_message";
dotenv.config();

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN_DEV!);

bot.use(session({ defaultSession: () => ({}) }));
setupAllCommands(bot);
setupActions(bot);
setupUserMessage(bot);

// Handler Firebase Functions
export const telegramBot = onRequest(async (req, res) => {
  bot
    .handleUpdate(req.body, res)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.error("Error handling update", err);
      res.status(500).end();
    });
});
