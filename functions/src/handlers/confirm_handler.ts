import {
  messageWithDismissButton,
  assetInfoTemp,
  sendMessage,
} from "../utils";
import { AssetInfo } from "../models/asset_info";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  failedUpdateMsg,
  succeedUpdateMsg,
} from "../utility/message";
import { saveIncomeToSpreadsheet } from "../services/asset_info_service";

export const confirmHandler = async (ctx: any) => {
  const assetId = ctx.match[0].split("confirm_")[1];
  const assetInfoTempData = assetInfoTemp.get(assetId);
  try {
    await ctx.answerCbQuery();
    messageWithDismissButton(
      ctx,
      assetInfoDisplayMsg(assetInfoTempData as AssetInfo)
    );
    if (!assetInfoTempData) {
      throw new Error(assetInfoNotFoundMsg);
    }
    await saveIncomeToSpreadsheet(assetInfoTempData as AssetInfo);
    sendMessage(ctx, succeedUpdateMsg(assetInfoTempData.name));
  } catch (error) {
    sendMessage(ctx, failedUpdateMsg);
  }
};
