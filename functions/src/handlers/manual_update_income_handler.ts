import { sendMessage, sendMessageWithButton } from "../utils";
import { getAllAssetNameButton } from "../utility/button";
import { getAllAssetInfo } from "../services/asset_info_service";
import { failedUpdateMsg } from "../utility/message";

export const manualUpdateHandler = async (ctx: any) => {
  const assetInfoList = await getAllAssetInfo();
  if (!assetInfoList) {
    sendMessage(ctx, failedUpdateMsg);
    return;
  }
  sendMessageWithButton(
    ctx,
    "Select the asset you want to update",
    getAllAssetNameButton(assetInfoList)
  );
};
