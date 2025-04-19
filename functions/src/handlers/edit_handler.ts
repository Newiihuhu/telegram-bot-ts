import { assetInfoNotFoundMsg } from "../utility/message";
import { assetInfoTemp } from "../utils";
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

  return ctx.reply(
    `What do you want to edit for "${assetInfo.name}"?\n- renter\n- amount\n- category\n- note\n\nPlease type "done" when you're finished selecting`
  );
};

export const saveAssetInfo = async (assetInfo: AssetInfo) => {
  await updateAssetInfoToSpreadsheet(assetInfo);
};
