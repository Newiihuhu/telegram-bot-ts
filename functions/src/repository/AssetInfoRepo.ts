import { LogConstants } from "../constant/Logs";
import {
  readFromSpreadsheet,
  insertDataToSpreadsheet,
} from "../data_source/GoogleSheetAPI";
import { AssetInfo } from "../models/AssetInfo";

const ASSETS_SHEET = "assets";
const INCOMES_SHEET = "incomes_history";
const ASSET_ID_COLUMN = "asset_id";

export const getAllAssetInfo = async (): Promise<AssetInfo[]> => {
  try {
    const response = await readFromSpreadsheet(`${ASSETS_SHEET}!A:F`);

    if (!response.data || response.data.values.length <= 1) {
      return [];
    }

    return response.data.values.slice(1).map((asset: any[]) => ({
      id: asset[0],
      name: asset[1],
      category: asset[2],
      renter: asset[3],
      amount: asset[4],
      payment_date: asset[5],
    }));
  } catch (error) {
    throw new Error(LogConstants.ERROR.GET_ASSET_INFO + error);
  }
};

export const getAssetInfoById = async (
  assetId: string
): Promise<AssetInfo | undefined> => {
  try {
    const response = await readFromSpreadsheet(
      `${ASSETS_SHEET}!A:F`,
      ASSET_ID_COLUMN,
      assetId
    );

    if (!response.data.values || response.data.values.length <= 1) {
      return undefined;
    }

    return {
      id: response.data.values[1][0],
      name: response.data.values[1][1],
      category: response.data.values[1][2],
      renter: response.data.values[1][3],
      amount: response.data.values[1][4],
      payment_date: response.data.values[1][5],
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(
      LogConstants.ERROR.GET_ASSET_INFO_BY_ID +
        assetId +
        " " +
        (error as Error).message
    );
  }
};

export const saveIncomeToSpreadsheet = async (
  assetInfo: AssetInfo
): Promise<boolean> => {
  try {
    const range = `${INCOMES_SHEET}!A:F`;
    const values = [
      [
        assetInfo.id,
        assetInfo.name,
        assetInfo.amount,
        new Date().toISOString(),
        "-",
      ],
    ];

    const response = await insertDataToSpreadsheet(range, values);
    return response.success;
  } catch (error) {
    throw new Error(
      LogConstants.ERROR.SAVE_INCOME_TO_SPREADSHEET + assetInfo.id
    );
  }
};

// export const updateAssetInfo = async (
//   assetInfo: AssetInfo
// ): Promise<boolean> => {
//   try {
//     validateAssetInfo(assetInfo);

//     const rows = await getAllAssetInfo();
//     const rowIndex = rows.findIndex((r: AssetInfo) => r.id === assetInfo.id);

//     if (rowIndex === -1) {
//       throw new AssetRepositoryError(`Asset with ID ${assetInfo.id} not found`);
//     }

//     const range = `${ASSETS_SHEET}!A${rowIndex + 2}:F${rowIndex + 2}`;
//     const values = [
//       [
//         assetInfo.id,
//         assetInfo.name,
//         assetInfo.category,
//         assetInfo.renter,
//         assetInfo.amount,
//         assetInfo.payment_date,
//       ],
//     ];

//     await updateDataToSpreadsheet(SPREADSHEET_ID, range, values);
//     return true;
//   } catch (error) {
//     const spreadsheetError = error as SpreadsheetError;
//     throw new AssetRepositoryError(
//       `Failed to update asset information for ID: ${assetInfo.id}`,
//       spreadsheetError
//     );
//   }
// };
