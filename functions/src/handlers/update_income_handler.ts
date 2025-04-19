import {
  alertMsg,
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  errorReadingSpreadsheetMsg,
} from "../utility/message";
import {
  confirmOrEditInfoButton,
  updateNowOrLaterButton,
} from "../utility/button";
import {
  assetNameTemp,
  messageWithDismissButton,
  assetInfoTemp,
  sendMessageWithButton,
} from "../utils";
import { getAssetInfoById } from "../services/asset_info_service";
export const startHandler = (ctx: any) => {
  ctx.reply("🚀 Bot ready to use. Try /test rrrr");
};

export const testHandler = async (ctx: any) => {
  const assetId = ctx.match[0].split("asset_")[1] ?? "A05";
  const assetInfo = await getAssetInfoById(assetId);
  if (!assetInfo) {
    ctx.reply(assetInfoNotFoundMsg);
    return;
  }

  assetInfoTemp.set(assetInfo.id, assetInfo);
  assetNameTemp.set(assetInfo.id, assetInfo.name);

  sendMessageWithButton(
    ctx,
    alertMsg(ctx.from.first_name, assetInfo.name),
    updateNowOrLaterButton(assetInfo.id)
  );
};

export const updateIncomeHandler = async (ctx: any) => {
  try {
    const assetId = ctx.match[0].split("update_now_")[1];
    const assetInfo = assetInfoTemp.get(assetId);
    await ctx.answerCbQuery();
    messageWithDismissButton(
      ctx,
      assetInfo
        ? alertMsg(ctx.from.first_name, assetInfo.name)
        : assetInfoNotFoundMsg
    );

    sendMessageWithButton(
      ctx,
      assetInfo ? assetInfoDisplayMsg(assetInfo) : assetInfoNotFoundMsg,
      confirmOrEditInfoButton(assetId)
    );
  } catch (error) {
    ctx.reply(errorReadingSpreadsheetMsg);
  }
};
