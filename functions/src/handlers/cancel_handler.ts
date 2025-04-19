import { AssetInfo } from "../models/asset_info";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  cancelUpdateMsg,
} from "../utility/message";
import { messageWithDismissButton, assetInfoTemp } from "../utils";

export const cancelHandler = async (ctx: any) => {
  const assetId = ctx.match[0].split("cancel_")[1];
  const assetInfoTempData = assetInfoTemp.get(assetId);
  await ctx.answerCbQuery();
  messageWithDismissButton(
    ctx,
    assetInfoDisplayMsg(assetInfoTempData as AssetInfo)
  );
  if (!assetInfoTempData) {
    throw new Error(assetInfoNotFoundMsg);
  }
  assetInfoTemp.delete(assetId);
  ctx.reply(cancelUpdateMsg);
};
