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

export const tempData = new Map<number, string>();
