// Create mock functions
const mockAppend = jest.fn();
const mockGet = jest.fn();

jest.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn().mockImplementation(() => ({
        getClient: jest.fn().mockResolvedValue({}),
      })),
    },
    sheets: jest.fn().mockReturnValue({
      spreadsheets: {
        values: {
          append: mockAppend,
          get: mockGet,
        },
      },
    }),
  },
}));

import {
  insertDataToSpreadsheet,
  readFromSpreadsheet,
} from "../../data_source/GoogleSheetAPI";
import { LogConstants } from "../../constant/Logs";

describe("GoogleSheetAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertDataToSpreadsheet", () => {
    const mockRange = "Sheet1!A1";
    const mockValues = [["test1", "test2"]];

    it("should successfully insert data to spreadsheet", async () => {
      const mockResponse = {
        status: 200,
        data: {},
      };

      mockAppend.mockResolvedValue(mockResponse);

      const result = await insertDataToSpreadsheet(mockRange, mockValues);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        LogConstants.SUCCESS.INSERT_DATA_TO_SPREADSHEET
      );
      expect(mockAppend).toHaveBeenCalledWith({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: mockRange,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: mockValues },
      });
    });

    it("should handle failed insertion", async () => {
      const mockResponse = {
        status: 400,
        data: {},
      };

      mockAppend.mockResolvedValue(mockResponse);

      const result = await insertDataToSpreadsheet(mockRange, mockValues);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        LogConstants.ERROR.INSERT_DATA_TO_SPREADSHEET
      );
    });

    it("should handle errors during insertion", async () => {
      const error = new Error("API Error");
      mockAppend.mockRejectedValue(error);

      await expect(
        insertDataToSpreadsheet(mockRange, mockValues)
      ).rejects.toThrow(LogConstants.ERROR.INSERT_DATA_TO_SPREADSHEET + error);
    });
  });

  describe("readFromSpreadsheet", () => {
    const mockRange = "Sheet1!A1:D10";
    const mockColumnName = "assetId";
    const mockFilterValue = "123";

    it("should successfully read data from spreadsheet without filtering", async () => {
      const mockResponse = {
        status: 200,
        data: {
          values: [
            ["header1", "header2"],
            ["value1", "value2"],
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await readFromSpreadsheet(mockRange);

      expect(result.success).toBe(true);
      expect(result.message).toBe(LogConstants.SUCCESS.READ_FROM_SPREADSHEET);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("should successfully read and filter data from spreadsheet", async () => {
      const mockResponse = {
        status: 200,
        data: {
          values: [
            ["assetId", "name"],
            ["123", "asset1"],
            ["456", "asset2"],
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await readFromSpreadsheet(
        mockRange,
        mockColumnName,
        mockFilterValue
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe(LogConstants.SUCCESS.READ_FROM_SPREADSHEET);
      expect(result.data).toEqual([
        ["assetId", "name"],
        ["123", "asset1"],
      ]);
    });

    it("should handle failed read operation", async () => {
      const mockResponse = {
        status: 400,
        data: {},
      };

      mockGet.mockResolvedValue(mockResponse);

      await expect(readFromSpreadsheet(mockRange)).rejects.toThrow(
        LogConstants.ERROR.READ_FROM_SPREADSHEET + "400"
      );
    });

    it("should handle errors during read operation", async () => {
      const error = new Error("API Error");
      mockGet.mockRejectedValue(error);

      await expect(readFromSpreadsheet(mockRange)).rejects.toThrow(
        LogConstants.ERROR.READ_FROM_SPREADSHEET + error
      );
    });
  });
});
