import { helpMsg } from "../constant/Message";
import { BotPlatform, CommandContext } from "../interfaces/BotInterface";

export const HelpMessage = async (
  context: CommandContext,
  bot: BotPlatform
) => {
  await bot.sendMessage(context.chatId, helpMsg);
};
