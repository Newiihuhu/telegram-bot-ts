import { assetInfoCache } from "../models/AssetInfo";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  cancelUpdateMsg,
  invalidFormatMsg,
} from "../constant/Message";
import { BotPlatform, CallbackContext } from "../interfaces/BotInterface";

export const CancelMessage = async (
  context: CallbackContext,
  bot: BotPlatform
) => {
  console.info(`CancelMessage from ${context.chatId} context: `, context);
  const assetId = context.callbackData.split("cancel_")[1];
  if (!assetId) {
    console.error(`Invalid callback data format: ${context.callbackData}`);
    await bot.sendMessage(context.chatId, invalidFormatMsg);
    return;
  }
  const assetInfo = assetInfoCache.get(assetId);
  if (!assetInfo) {
    await bot.sendMessage(context.chatId, assetInfoNotFoundMsg);
    return;
  }
  await bot.editMessage(
    context.chatId,
    context.messageId,
    assetInfoDisplayMsg(assetInfo)
  );

  await bot.sendMessage(context.chatId, cancelUpdateMsg);
  assetInfoCache.delete(assetId);
};
