import { BotPlatform, CallbackContext } from "../interfaces/BotInterface";
import {
  alertMsg,
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  invalidFormatMsg,
} from "../constant/Message";
import { confirmOrEditInfoButton } from "../constant/Button";
import { assetInfoCache } from "../models/AssetInfo";

export const UpdateAssetIncome = async (
  context: CallbackContext,
  bot: BotPlatform
) => {
  const assetId = context.callbackData.split("update_now_")[1];
  if (!assetId) {
    console.error(`Invalid callback data format: ${context.callbackData}`);
    await bot.sendMessage(context.chatId, invalidFormatMsg);
    return;
  }
  const assetInfo = assetInfoCache.get(assetId);
  if (!assetInfo) {
    console.error(
      `Asset info not found for [${assetId} when loading from cache]`
    );
    await bot.sendMessage(context.chatId, assetInfoNotFoundMsg);
    return;
  }

  await bot.editMessage(
    context.chatId,
    context.messageId,
    alertMsg(assetInfo.name),
    {
      parseMode: "Markdown",
    }
  );

  await bot.sendMessageWithButtons(
    context.chatId,
    assetInfoDisplayMsg(assetInfo),
    confirmOrEditInfoButton(assetId),
    {
      parseMode: "Markdown",
    }
  );
};
