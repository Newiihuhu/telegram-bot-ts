import { assetInfoCache } from "../models/AssetInfo";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  failedUpdateMsg,
  invalidFormatMsg,
  succeedUpdateMsg,
} from "../constant/Message";
import { saveIncomeToSpreadsheet } from "../repository/AssetInfoRepo";
import { BotPlatform, CallbackContext } from "../interfaces/BotInterface";

export const ConfirmMessage = async (
  context: CallbackContext,
  bot: BotPlatform
) => {
  const assetId = context.callbackData.split("confirm_")[1];
  if (!assetId) {
    console.error(`Invalid callback data format: ${context.callbackData}`);
    await bot.sendMessage(context.chatId, invalidFormatMsg);
    return;
  }
  const assetInfo = assetInfoCache.get(assetId);
  console.info(`ConfirmMessage from ${context.chatId} context: `, context);
  if (!assetInfo) {
    await bot.sendMessage(context.chatId, assetInfoNotFoundMsg);
    return;
  }
  await bot.editMessage(
    context.chatId,
    context.messageId,
    assetInfoDisplayMsg(assetInfo)
  );

  const result = await saveIncomeToSpreadsheet(assetInfo);
  if (!result) {
    await bot.sendMessage(context.chatId, failedUpdateMsg);
    return;
  }
  console.info(`ConfirmMessage saved ${assetInfo.name} to spreadsheet`);
  await bot.sendMessage(context.chatId, succeedUpdateMsg(assetInfo.name));
};
