import {
  readFromSpreadsheet,
  insertDataToSpreadsheet,
  updateDataToSpreadsheet,
} from "../handlers/google_sheet_handlers";
import { AssetInfo } from "../models/asset_info";
export const getAllAssetInfo = async () => {
  try {
    const data = await readFromSpreadsheet(
      process.env.SPREADSHEET_ID as string,
      "assets!A:F"
    );
    if (!data.values || data.values.length <= 1) {
      return;
    }
    const assetInfoList: AssetInfo[] = data.values
      .slice(1)
      .map((asset: any) => ({
        id: asset[0],
        name: asset[1],
        category: asset[2],
        renter: asset[3],
        amount: asset[4],
        payment_date: asset[5],
      }));
    return assetInfoList;
  } catch (error) {
    console.error("Error reading from spreadsheet:", error);
    return [];
  }
};

export const getAssetInfoById = async (assetId: string) => {
  const data = await readFromSpreadsheet(
    process.env.SPREADSHEET_ID as string,
    "assets!A:E",
    "Asset_ID",
    assetId
  );
  if (!data.values || data.values.length <= 1) {
    return;
  }

  const assetInfo: AssetInfo = {
    id: data.values[1][0],
    name: data.values[1][1],
    category: data.values[1][2],
    renter: data.values[1][3],
    amount: data.values[1][4],
    payment_date: data.values[1][5],
    updated_at: new Date().toISOString(),
    note: "-",
  };
  return assetInfo;
};

export const updateAssetInfoToSpreadsheet = async (assetInfo: AssetInfo) => {
  const rows = await getAllAssetInfo();
  if (!rows) {
    return;
  }

  const rowIndex = rows.findIndex((r: AssetInfo) => r.id === assetInfo.id);
  console.log("rowIndex: ", rowIndex);
  if (rowIndex === -1) return false;
  const range = `assets!A${rowIndex + 2}:F${rowIndex + 2}`;
  const values = [
    [
      assetInfo.id,
      assetInfo.name,
      assetInfo.category,
      assetInfo.renter,
      assetInfo.amount,
      assetInfo.payment_date,
    ],
  ];
  return await updateDataToSpreadsheet(
    process.env.SPREADSHEET_ID as string,
    range,
    values
  );
};

export const saveIncomeToSpreadsheet = async (assetInfo: AssetInfo) => {
  const range = "incomes_history!A:F";
  const values = [
    [
      assetInfo.id,
      assetInfo.name,
      assetInfo.amount,
      assetInfo.updated_at,
      assetInfo.note,
    ],
  ];
  return await insertDataToSpreadsheet(
    process.env.SPREADSHEET_ID as string,
    range,
    values
  );
};
