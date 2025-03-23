import { Telegraf, Context } from "telegraf";
import { startHandler } from "../handlers/handles";

export function setupCommands(bot: Telegraf<Context>) {
  bot.start(startHandler);
}
