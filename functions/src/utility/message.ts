import { session } from "telegraf";
import { AssetInfo } from "../models/asset_info";

export const alertMsg = (userName: String, assetName: String) =>
  `🔔 ${userName}! Time to update ${assetName}'s rent! 💰🏠`;

export const succeedUpdateMsg = (assetName: String) =>
  `✅ Updated ${assetName} to Google Sheets Successfully! 🎉`;

export const failedUpdateMsg =
  "❌ Failed to update and save to Google Sheets. Please try again. 🤖";

export const helpMsg =
  "💬 I can help you create and update your asset info! \nYou can control me by sending these commands\n\n" +
  "/all_assets - See all your assets \n" +
  "/update_income - Update your income history \n" +
  "/update_asset - Update your asset info \n\n" +
  "The commands above will not available for now\n" +
  "/update_payment_date - Update your payment date \n" +
  "/all_schedule - See all your schedule \n" +
  "/change_schedule - Update your schedule \n" +
  "/report - See your report \n";

export const assetInfoNotFoundMsg = "🔍 Asset not found. Please try again.";

export const selectAssetMsg = "🔍 Select the asset you want to update";

export const cancelUpdateMsg =
  "👋 Cancelled. Please do /update_income to manually update your income history";

export const errorReadingSpreadsheetMsg =
  "🔍 Sorry, there was an error reading the data. Please try again later.";

export const assetInfoMsg = (assetInfo: AssetInfo) =>
  `🏠 ${assetInfo.name}\n` +
  `👤 Renter: ${assetInfo.renter}\n` +
  `💰 Amount: ${assetInfo.amount}\n` +
  `💳 Category: ${assetInfo.category}\n` +
  `📋 Note: ${assetInfo.note || "-"}`;

export const assetInfoDisplayMsg = (assetInfo: AssetInfo) =>
  "*Asset Information*\n\n" + assetInfoMsg(assetInfo);

export const assetInfoListDisplayMsg = (assetInfoList: AssetInfo[]) =>
  assetInfoList.map((assetInfo) => assetInfoMsg(assetInfo)).join("\n\n");

export const editAnotherFieldsOrTypeDoneMsg =
  "💬 Do you want to edit another field or type *done* to finish editing";

export const defaultMsg = "💬 I don't understand that command";

export const editAssetMsg = (assetInfo: AssetInfo) =>
  `💬 What do you want to edit for "${assetInfo.name}"?\n` +
  `- renter\n` +
  `- amount\n` +
  `- category\n` +
  `- note`;

export const editAssetToNewValueMsg = (field: string, newValue: string) =>
  `💬 Updated *"${field}"* to *"${newValue}"*`;
