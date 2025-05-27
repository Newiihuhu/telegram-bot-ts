import { BotPlatform } from "../interfaces/BotInterface";
import { defaultMsg } from "../constant/Message";

export function setupUserMessage(bot: BotPlatform) {
  bot.handleUserMessage(async (context) => {
    await bot.sendMessage(context.chatId, defaultMsg);
  });
}
