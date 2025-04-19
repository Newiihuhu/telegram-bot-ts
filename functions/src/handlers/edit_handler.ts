import { assetInfoNotFoundMsg, editAssetMsg } from "../utility/message";
import { assetInfoTemp, sendMessage } from "../utils";
import { BotContext } from "../models/session_data";
import { AssetInfo } from "../models/asset_info";
import { updateAssetInfoToSpreadsheet } from "../services/asset_info_service";

export const editHandler = async (
  ctx: BotContext & { match: RegExpExecArray }
) => {
  const assetId = ctx.match[0].split("edit_")[1];
  console.log("assetId: ", assetId);
  const assetInfo = assetInfoTemp.get(assetId);
  if (!assetInfo) {
    throw new Error(assetInfoNotFoundMsg);
  }

  ctx.session.editingAssetId = assetId;
  ctx.session.editStep = "waiting_for_field";

  return sendMessage(ctx, editAssetMsg(assetInfo));
};

export const saveAssetInfo = async (assetInfo: AssetInfo) => {
  await updateAssetInfoToSpreadsheet(assetInfo);
};
