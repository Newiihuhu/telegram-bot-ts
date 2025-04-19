import { AssetInfo } from "./models/asset_info";

export const sendMessage = (ctx: { reply: Function }, text: string) => {
  ctx.reply(text, {
    parse_mode: "Markdown",
  });
};

export const sendMessageWithButton = (
  ctx: { reply: Function },
  text: string,
  buttons: Array<Array<{ text: string; callback_data: string }>>
) => {
  ctx.reply(text, {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: buttons },
  });
};

export const messageWithDismissButton = (
  ctx: { editMessageText: Function },
  text: string
) => {
  ctx.editMessageText(text, {
    parse_mode: "Markdown",
  });
};


export const assetInfoTemp = new Map<string, AssetInfo>();

export const assetInfoListTemp = new Map<string, AssetInfo[]>();

export const assetNameTemp = new Map<string, string>();
