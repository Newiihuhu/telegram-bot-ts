import { Telegraf } from "telegraf";
import {
  testHandler,
  updateIncomeHandler,
} from "../handlers/update_income_handler";
import { confirmHandler } from "../handlers/confirm_handler";
import { cancelHandler } from "../handlers/cancel_handler";
import { editHandler } from "../handlers/edit_handler";
import { BotContext } from "../models/session_data";

export function setupActions(bot: Telegraf<BotContext>) {
  bot.action(/^update_now_[A-Z]\d{2}$/, async (ctx) =>
    updateIncomeHandler(ctx)
  );
  bot.action(/^confirm_[A-Z]\d{2}$/, async (ctx) => confirmHandler(ctx));
  bot.action(/^cancel_[A-Z]\d{2}$/, async (ctx) => cancelHandler(ctx));
  bot.action(/^asset_[A-Z]\d{2}$/, async (ctx) => testHandler(ctx));
  bot.action(/^edit_[A-Z]\d{2}$/, async (ctx) => editHandler(ctx));
}
