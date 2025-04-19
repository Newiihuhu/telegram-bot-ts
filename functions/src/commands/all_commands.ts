import { Telegraf } from "telegraf";
import { helpHandler } from "../handlers/help_handler";
import { startHandler, testHandler } from "../handlers/update_income_handler";
import { manualUpdateHandler } from "../handlers/manual_update_income_handler";
import { BotContext } from "../models/session_data";

export function setupAllCommands(bot: Telegraf<BotContext>) {
  bot.start(startHandler);
  bot.command("test", testHandler);
  bot.command("help", helpHandler);
  bot.command("manual_update_income", manualUpdateHandler);
}
