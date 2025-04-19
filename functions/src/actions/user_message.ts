import { Telegraf } from "telegraf";
import { sendMessage } from "../utils";
import { BotContext } from "../models/session_data";
import { AssetInfo } from "../models/asset_info";
import { assetInfoTemp, sendMessageWithButton } from "../utils";
import { confirmOrEditInfoButton } from "../utility/button";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  editAnotherFieldsOrTypeDoneMsg,
  defaultMsg,
  editAssetToNewValueMsg,
} from "../utility/message";
import { saveAssetInfo } from "../handlers/edit_handler";

export function setupUserMessage(bot: Telegraf<BotContext>) {
  bot.on("message", async (ctx: BotContext) => {
    const session = ctx.session;
    if (!ctx.message || !("text" in ctx.message)) {
      return ctx.reply("💬 Please send a text message");
    }

    const text = ctx.message.text.trim();
    if (!session.editingAssetId) {
      return ctx.reply("💬 No asset selected for editing");
    }
    const assetInfo = assetInfoTemp.get(session.editingAssetId);
    if (!assetInfo) {
      return sendMessage(ctx, assetInfoNotFoundMsg);
    }
    if (text.toLowerCase() === "done" && session.editingAssetId) {
      ctx.session = {};
      session.editStep = undefined;
      session.editingAssetId = undefined;
      session.fieldToEdit = undefined;
      await saveAssetInfo(assetInfo);
      return sendMessageWithButton(
        ctx,
        assetInfo ? assetInfoDisplayMsg(assetInfo) : assetInfoNotFoundMsg,
        confirmOrEditInfoButton(assetInfo.id)
      );
    }

    if (session.editStep === "waiting_for_field" && session.editingAssetId) {
      const field = text as keyof AssetInfo;
      if (
        !["renter", "amount", "category", "note", "done"].includes(
          field.toLowerCase()
        )
      ) {
        return ctx.reply(
          "💬 Please specify only renter, amount, category or note, or type *done* to finish editing"
        );
      }

      session.fieldToEdit = field;
      session.editStep = "waiting_for_value";

      return ctx.reply(`💬 Please enter the new value for *"${field}"*`);
    }

    if (
      session.editStep === "waiting_for_value" &&
      session.editingAssetId &&
      session.fieldToEdit
    ) {
      const newValue: string = text;

      switch (session.fieldToEdit) {
        case "renter":
          assetInfo.renter = newValue;
          break;
        case "amount":
          assetInfo.amount = newValue;
          break;
        case "category":
          assetInfo.category = newValue;
          break;
        case "note":
          assetInfo.note = newValue;
          break;
      }
      assetInfoTemp.set(session.editingAssetId, assetInfo);
      console.log("assetInfo:", assetInfo);
      session.editStep = "waiting_for_field";

      await sendMessage(
        ctx,
        editAssetToNewValueMsg(session.fieldToEdit, newValue)
      );
      return sendMessage(ctx, editAnotherFieldsOrTypeDoneMsg);
    }
    return sendMessage(ctx, defaultMsg);
  });
}
