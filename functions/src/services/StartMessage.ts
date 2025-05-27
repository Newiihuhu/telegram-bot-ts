import { CommandContext } from "../interfaces/BotInterface";

import { BotPlatform } from "../interfaces/BotInterface";
import { startMsg } from "../constant/Message";

export const StartMessage = async (
  context: CommandContext,
  bot: BotPlatform
) => {
  await bot.sendMessage(context.chatId, startMsg);
};
