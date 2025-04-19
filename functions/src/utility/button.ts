import { AssetInfo } from "../models/asset_info";

export const updateNowOrLaterButton = (assetId: string) => [
  [
    { text: "✅ Update now", callback_data: `update_now_${assetId}` },
    { text: "⏳ Later", callback_data: "later" },
  ],
];

export const confirmOrEditInfoButton = (assetId: string) => [
  [
    { text: "✅ Confirm", callback_data: `confirm_${assetId}` },
    { text: "📝 Edit", callback_data: `edit_${assetId}` },
  ],
  [{ text: "✖️ Cancel", callback_data: `cancel_${assetId}` }],
];

export const getAllAssetNameButton = (data: AssetInfo[]) => {
  const assetInfoList = [];
  for (let i = 0; i < data.length; i += 2) {
    const row = [];
    row.push({
      text: data[i].name,
      callback_data: `asset_${data[i].id}`,
    });
    if (i + 1 < data.length) {
      row.push({
        text: data[i + 1].name,
        callback_data: `asset_${data[i + 1].id}`,
      });
    }
    assetInfoList.push(row);
  }
  return assetInfoList;
};
