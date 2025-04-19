import { AssetInfo } from "../models/asset_info";

export const alertMsg = (userName: String, assetName: String) =>
  `🔔 Hey ${userName}! Time to update ${assetName}'s rent! 💰🏠`;

export const succeedUpdateMsg = (assetName: String) =>
  `✅ Updated ${assetName} to Google Sheets Successfully! 🎉`;

export const failedUpdateMsg =
  "❌ Failed to update and save to Google Sheets. Please try again. 🤖";

export const editInfoMsg =
  "💬 Here's the format to update your info! \nCopy/paste and edit on your keyboard\n";

export const helpMsg =
  "I can help you create and update your asset info! \nYou can control me by sending these commands\n\n" +
  "/all_assets - See all your assets \n" +
  "/manual_update_income - Update your income history \n" +
  "/update_asset - Update your asset info \n" +
  "/update_payment_date - Update your payment date \n" +
  "/all_schedule - See all your schedule \n" +
  "/change_schedule - Update your schedule \n";

export const assetInfoNotFoundMsg = "🔍 Asset not found. Please try again.";

export const cancelUpdateMsg =
  "👋 Cancelled. Please do /manual_save_income to update your income history";

export const errorReadingSpreadsheetMsg =
  "🔍Sorry, there was an error reading the data. Please try again later.";

export const assetInfoDisplayMsg = (assetInfo: AssetInfo) =>
  "*Asset Information*\n\n" +
  `🏠 ${assetInfo.name}\n` +
  `👤 Renter: ${assetInfo.renter}\n` +
  `💰 Amount: ${assetInfo.amount}\n` +
  `📅 Date: ${assetInfo.updated_at}\n` +
  `💳 Category: ${assetInfo.category}\n` +
  `📋 Note: ${assetInfo.note}`;

export const editAnotherFieldsOrTypeDoneMsg =
  "Do you want to edit another field or type 'done' to finish editing";

export const defaultMsg = "I don't understand that command";