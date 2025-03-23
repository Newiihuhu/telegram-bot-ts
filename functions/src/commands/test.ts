import { Context, Telegraf } from "telegraf";
import { testHandler } from "../handlers/handles";

export function testCommands(bot: Telegraf<Context>) {
  bot.command("test", testHandler);
}
