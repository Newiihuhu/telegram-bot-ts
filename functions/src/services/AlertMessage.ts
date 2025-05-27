import {
  assetInfoNotFoundMsg,
  errorReadingSpreadsheetMsg,
  invalidFormatMsg,
} from "../constant/Message";

import { assetInfoCache, assetNameCache } from "../models/AssetInfo";

import { updateNowOrLaterButton } from "../constant/Button";
import { alertMsg } from "../constant/Message";
import { getAssetInfoById } from "../repository/AssetInfoRepo";
import { BotPlatform } from "../interfaces/BotInterface";
import { CallbackContext, CommandContext } from "../interfaces/BotInterface";

export const AlertMessage = async (
  context: CallbackContext | CommandContext,
  bot: BotPlatform
) => {
  try {
    let assetId = "A01";
    // const assetId = context.callbackData.split("alert_")[1];
    if (!assetId) {
      // console.error(`Invalid callback data format: ${context.callbackData}`);
      await bot.sendMessage(context.chatId, invalidFormatMsg);
      return;
    }
    const assetInfo = await getAssetInfoById(assetId);
    if (!assetInfo) {
      console.error(`Asset info not found for [${assetId}]`);
      await bot.sendMessage(context.chatId, assetInfoNotFoundMsg);
      return;
    }

    assetInfoCache.set(assetInfo.id, assetInfo);
    assetNameCache.set(assetInfo.id, assetInfo.name);

    console.info(`Alert message for [${assetInfo.name}]`);
    await bot.sendMessageWithButtons(
      context.chatId,
      alertMsg(assetInfo.name),
      updateNowOrLaterButton(assetInfo.id),
      {
        parseMode: "Markdown",
      }
    );
  } catch (error) {
    console.error(`Error in AlertMessage: ${error}`);
    await bot.sendMessage(context.chatId, errorReadingSpreadsheetMsg);
  }
};
