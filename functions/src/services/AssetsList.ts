import { getAllAssetInfo } from "../repository/AssetInfoRepo";
import {
  assetInfoListDisplayMsg,
  assetInfoNotFoundMsg,
  errorReadingSpreadsheetMsg,
} from "../constant/Message";
import { BotPlatform, CommandContext } from "../interfaces/BotInterface";

export const AssetList = async (context: CommandContext, bot: BotPlatform) => {
  try {
    const assetInfoList = await getAllAssetInfo();
    if (!assetInfoList || assetInfoList.length === 0) {
      console.error("No asset info found");
      await bot.sendMessage(context.chatId, assetInfoNotFoundMsg);
      return;
    }
    await bot.sendMessage(
      context.chatId,
      assetInfoListDisplayMsg(assetInfoList)
    );
  } catch (error) {
    console.error(`Error in AssetList: ${error}`);
    await bot.sendMessage(context.chatId, errorReadingSpreadsheetMsg);
  }
};
