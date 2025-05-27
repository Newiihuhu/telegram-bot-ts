export class LogConstants {
  static readonly SUCCESS = {
    INSERT_DATA_TO_SPREADSHEET: "Insert data to spreadsheet success",
    READ_FROM_SPREADSHEET: "Read from spreadsheet success",
  };

  static readonly ERROR = {
    INSERT_DATA_TO_SPREADSHEET: "Insert data to spreadsheet failed",
    SAVE_INCOME_TO_SPREADSHEET: "Save income to spreadsheet failed for asset id: ",
    READ_FROM_SPREADSHEET: "Read from spreadsheet failed",
    GET_GOOGLE_SHEET_CLIENT: "Get google sheet client failed",
    GET_ASSET_INFO_BY_ID: "Get asset info by id failed: ",
    GET_ASSET_INFO: "Get asset info failed",
  };
}