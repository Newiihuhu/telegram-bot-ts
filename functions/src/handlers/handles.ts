import { sendMessageWithButton } from "../utils";
import { readFromSpreadsheet } from "./google_sheet_handlers";

export const startHandler = (ctx: any) => {
  ctx.reply("🚀 Bot ready to use. Try /test");
};

export const testHandler = (ctx: any) => {
  sendMessageWithButton(ctx, "🔔 Hey Max! Time to update Room1's rent! 💰🏠", [
    [
      { text: "✅ Update now", callback_data: "update_now" },
      { text: "⏳ Later", callback_data: "later" },
    ],
  ]);
};

export const updateHandler = async (ctx: any) => {
  // const userId = ctx.from.id;
  const data = await readFromSpreadsheet(
    process.env.SPREADSHEET_ID as string,
    "assets!A:F",
    "Assets_ID",
    "A05"
  );
  console.log(data);
  //   const inputMap = parseInputToMap(data);
  // tempData.set(userId, inputMap);
};
