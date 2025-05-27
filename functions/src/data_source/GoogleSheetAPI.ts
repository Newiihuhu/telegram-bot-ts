import { google, sheets_v4 } from "googleapis";
import { ResponseData } from "../interfaces/ResponseData";
import { LogConstants } from "../constant/Logs";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string;
const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

type SpreadsheetValue = string | number | boolean | null;
type SpreadsheetRow = SpreadsheetValue[];
type SpreadsheetData = SpreadsheetRow[];

async function getGoogleSheetClient(): Promise<sheets_v4.Sheets> {
  try {
    const client = await auth.getClient();
    return google.sheets({ version: "v4", auth: client as any });
  } catch (error) {
    throw new Error(LogConstants.ERROR.GET_GOOGLE_SHEET_CLIENT + error);
  }
}

export async function insertDataToSpreadsheet(
  range: string,
  values: SpreadsheetData
): Promise<ResponseData> {
  try {
    const sheets = await getGoogleSheetClient();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    if (response.status === 200) {
      console.info(LogConstants.SUCCESS.INSERT_DATA_TO_SPREADSHEET);
      return {
        success: true,
        message: LogConstants.SUCCESS.INSERT_DATA_TO_SPREADSHEET,
      };
    }
    return {
      success: false,
      message: LogConstants.ERROR.INSERT_DATA_TO_SPREADSHEET,
    };
  } catch (error) {
    throw new Error(LogConstants.ERROR.INSERT_DATA_TO_SPREADSHEET + error);
  }
}

export async function readFromSpreadsheet(
  range: string,
  columnName?: string,
  filterValue?: string
): Promise<ResponseData> {
  try {
    const sheets = await getGoogleSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    if (response.status === 200) {
      console.info(LogConstants.SUCCESS.READ_FROM_SPREADSHEET);

      if (response.data.values) {
        const headers = response.data.values[0];
        const assetsIdColumnIndex = headers.indexOf(columnName);

        if (assetsIdColumnIndex !== -1) {
          const filteredValues = response.data.values.filter((row, index) => {
            if (index === 0) return true;
            return row[assetsIdColumnIndex] === filterValue;
          });

          return {
            success: true,
            message: LogConstants.SUCCESS.READ_FROM_SPREADSHEET,
            data: filteredValues,
          };
        }
      }

      return {
        success: true,
        message: LogConstants.SUCCESS.READ_FROM_SPREADSHEET,
        data: response.data,
      };
    }

    throw new Error(LogConstants.ERROR.READ_FROM_SPREADSHEET + response.status);
  } catch (error) {
    throw new Error(LogConstants.ERROR.READ_FROM_SPREADSHEET + error);
  }
}


// export async function updateDataToSpreadsheet(
//   spreadsheetId: string,
//   range: string,
//   values: any[][]
// ): Promise<sheets_v4.Schema$AppendValuesResponse> {
//   const sheets = await getGoogleSheetClient();
//   const response = await sheets.spreadsheets.values.update({
//     spreadsheetId,
//     range,
//     valueInputOption: "USER_ENTERED",
//     requestBody: {
//       values,
//     },
//   });
//   return response.data;
// }