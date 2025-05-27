import { AssetInfo } from "../models/AssetInfo";

export const alertMsg = (assetName: String) =>
  `🔔 Hello! Time to update ${assetName}'s rent! 💰🏠`;

export const succeedUpdateMsg = (assetName: String) =>
  `✅ Updated ${assetName} to Google Sheets Successfully! 🎉`;

export const failedUpdateMsg =
  "❌ Failed to update and save to Google Sheets. Please try again. 🤖";

export const helpMsg =
  "💬 I can help you create and update your asset info! \nYou can control me by sending these commands\n\n" +
  "/all_assets - See all your assets \n" +
  "/all_schedule - See all your schedule \n" +
  "/report - See your report \n";

export const assetInfoNotFoundMsg = "🔍 No assets found. Please try again.";
export const invalidFormatMsg = "🔍 Invalid format. Please try again.";

export const cancelUpdateMsg = "👋 Cancelled. Please do update income manually";

export const errorReadingSpreadsheetMsg =
  "🔍 Sorry, there was an error reading the data. Please try again later.";

export const assetInfoMsg = (assetInfo: AssetInfo) =>
  `🏠 ${assetInfo.name}\n` +
  `👤 Renter: ${assetInfo.renter}\n` +
  `💰 Amount: ${assetInfo.amount}\n` +
  `💳 Category: ${assetInfo.category}`;

export const assetInfoDisplayMsg = (assetInfo: AssetInfo) =>
  "*Asset Information*\n\n" + assetInfoMsg(assetInfo);

export const assetInfoListDisplayMsg = (assetInfoList: AssetInfo[]) =>
  assetInfoList.map((assetInfo) => assetInfoMsg(assetInfo)).join("\n\n");

export const defaultMsg = "💬 I don't understand that command";

export const startMsg =
  "👋 Hello! I'm the Asset Management Bot. How can I help you today?🤔\n\nMaybe try /help";
