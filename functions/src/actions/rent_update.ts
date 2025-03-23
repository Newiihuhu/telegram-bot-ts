import { Telegraf, Context } from "telegraf";
import { updateHandler } from "../handlers/handles";

export function setupActions(bot: Telegraf<Context>) {
  bot.action("check_now", async (ctx) => updateHandler(ctx));
}
