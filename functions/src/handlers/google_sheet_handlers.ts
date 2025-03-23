import { google, sheets_v4 } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function getGoogleSheetClient(): Promise<sheets_v4.Sheets> {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client as any });
}

export async function writeToSpreadsheet(
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<sheets_v4.Schema$AppendValuesResponse> {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values,
    },
  });
  return response.data;
}

export async function readFromSpreadsheet(
  spreadsheetId: string,
  range: string,
  columnName?: string,
  filterValue?: string
): Promise<sheets_v4.Schema$ValueRange> {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  if (columnName && filterValue && response.data.values) {
    // Find column index by name (assuming first row contains headers)
    const headers = response.data.values[0];
    const columnIndex = headers.indexOf(columnName);

    if (columnIndex !== -1) {
      // Filter rows where the specified column matches the filter value
      const filteredValues = response.data.values.filter((row, index) => {
        if (index === 0) return true; // Keep header row
        return row[columnIndex] === filterValue;
      });

      return {
        ...response.data,
        values: filteredValues,
      };
    }
  }

  return response.data;
}
