import { BotContext } from "../models/session_data";
import { getAllAssetInfo } from "../services/asset_info_service";
import { sendMessage } from "../utils";
import { assetInfoListDisplayMsg, failedUpdateMsg } from "../utility/message";

export const assetListHandler = async (ctx: BotContext) => {
  const assetInfoList = await getAllAssetInfo();
  if (!assetInfoList) {
    sendMessage(ctx, failedUpdateMsg);
    return;
  }
  sendMessage(ctx, assetInfoListDisplayMsg(assetInfoList));
};
