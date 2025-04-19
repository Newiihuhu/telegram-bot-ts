import { helpMsg } from "../utility/message";

export const helpHandler = async (ctx: any) => {
  ctx.reply(helpMsg);
};
