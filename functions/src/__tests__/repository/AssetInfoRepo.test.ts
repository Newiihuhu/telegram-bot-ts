import {
  getAllAssetInfo,
  getAssetInfoById,
  saveIncomeToSpreadsheet,
} from "../../repository/AssetInfoRepo";
import {
  readFromSpreadsheet,
  insertDataToSpreadsheet,
} from "../../data_source/GoogleSheetAPI";
import { AssetInfo } from "../../models/AssetInfo";

jest.mock("../../data_source/google_sheet");

describe("AssetInfoRepo", () => {
  const mockDate = new Date("2025-04-30T10:00:00.000Z");

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getAllAssetInfo", () => {
    it("should return empty array when no data exists", async () => {
      // Given
      (readFromSpreadsheet as jest.Mock).mockResolvedValue({ values: [] });

      // When
      const result = await getAllAssetInfo();

      // Then
      expect(result).toEqual([]);
    });

    it("should return assets list when data exists", async () => {
      // Given
      const mockResponseData = {
        success: true,
        message: "Read from spreadsheet success",
        data: {
          values: [
            ["id", "name", "category", "renter", "amoun t", "payment_date"], // header
            ["1", "Asset 1", "Category 1", "Renter 1", "1000", "2024-03-20"],
            ["2", "Asset 2", "Category 2", "Renter 2", "2000", "2024-03-21"],
          ],
        },
      };

      (readFromSpreadsheet as jest.Mock).mockResolvedValue(mockResponseData);

      // When
      const result = await getAllAssetInfo();

      // Then
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        name: "Asset 1",
        category: "Category 1",
        renter: "Renter 1",
        amount: "1000",
        payment_date: "2024-03-20",
      });
    });

    it("should throw error when fail to retrieve spreadsheet", async () => {
      // Given
      (readFromSpreadsheet as jest.Mock).mockRejectedValue(
        new Error("Read failed")
      );

      // When
      const result = getAllAssetInfo();

      // Then
      expect(result).rejects.toThrow("Get asset info failed");
    });
  });

  describe("getAssetInfoById", () => {
    it("should return asset info", async () => {
      // Given
      const mockResponseData = {
        success: true,
        message: "Read from spreadsheet success",
        data: {
          values: [
            ["id", "name", "category", "renter", "amount", "payment_date"], // header
            ["1", "Asset 1", "Category 1", "Renter 1", "1000", "2025-03-20"],
          ],
        },
      };

      (readFromSpreadsheet as jest.Mock).mockResolvedValue(mockResponseData);

      // When
      const result = await getAssetInfoById("1");

      // Then
      expect(result).toEqual({
        id: "1",
        name: "Asset 1",
        category: "Category 1",
        renter: "Renter 1",
        amount: "1000",
        payment_date: "2025-03-20",
        updated_at: mockDate.toISOString(),
      });
    });

    it("should return undefined when asset not found or empty", async () => {
      // Given
      (readFromSpreadsheet as jest.Mock).mockResolvedValue({
        success: true,
        message: "Read from spreadsheet success",
        data: { values: [] },
      });

      // When
      const result = await getAssetInfoById("assetId");

      // Then
      expect(result).toBeUndefined();
    });

    it("should throw error when fail to retrieve spreadsheet", async () => {
      // Given
      (readFromSpreadsheet as jest.Mock).mockRejectedValue(
        new Error("Read failed")
      );

      // When
      const result = getAssetInfoById("1");

      // Then
      expect(result).rejects.toThrow(
        "Get asset info by id failed: 1 Read failed"
      );
    });
  });

  describe("saveIncomeToSpreadsheet", () => {
    const mockAssetInfo: AssetInfo = {
      id: "1",
      name: "Asset 1",
      amount: "1000",
      category: "Category 1",
      renter: "Renter 1",
      payment_date: "2024-03-20",
    };

    it("should successfully save income", async () => {
      // Given
      (insertDataToSpreadsheet as jest.Mock).mockResolvedValue({
        success: true,
      });

      // When
      const result = await saveIncomeToSpreadsheet(mockAssetInfo);

      // Then
      expect(result).toBe(true);
      expect(insertDataToSpreadsheet).toHaveBeenCalled();
    });

    it("should return false when insertDataToSpreadsheet not success", async () => {
      // Given
      (insertDataToSpreadsheet as jest.Mock).mockResolvedValue({
        success: false,
      });

      // When
      const result = await saveIncomeToSpreadsheet(mockAssetInfo);

      // Then
      expect(result).toBe(false);
      expect(insertDataToSpreadsheet).toHaveBeenCalled();
    });

    it("should throw error when insert data to spreadsheet fails", async () => {
      // Given
      (insertDataToSpreadsheet as jest.Mock).mockRejectedValue(
        new Error("Insert failed")
      );

      // When
      const result = saveIncomeToSpreadsheet(mockAssetInfo);

      // Then
      await expect(result).rejects.toThrow(
        "Save income to spreadsheet failed for asset id: 1"
      );
    });
  });
});
