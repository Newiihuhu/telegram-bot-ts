import { BotPlatform, CallbackContext } from "../../interfaces/BotInterface";
import {
  alertMsg,
  assetInfoNotFoundMsg,
  errorReadingSpreadsheetMsg,
  invalidFormatMsg,
} from "../../constant/Message";
import {
  AssetInfo,
  assetInfoCache,
  assetNameCache,
} from "../../models/AssetInfo";
import { AlertMessage } from "../../services/AlertMessage";
import { getAssetInfoById } from "../../repository/AssetInfoRepo";
import { updateNowOrLaterButton } from "../../constant/Button";

// Mock dependencies
jest.mock("../../constant/Button");
jest.mock("../../repository/AssetInfoRepo");

describe("AlertMessage", () => {
  let mockBot: jest.Mocked<BotPlatform>;
  let mockContext: CallbackContext;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn(),
      sendMessageWithButtons: jest.fn(),
      editMessage: jest.fn(),
      handleCommand: jest.fn(),
      handleCallbackQuery: jest.fn(),
      handleUserMessage: jest.fn(),
      handleWebhookUpdate: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };

    mockContext = {
      chatId: "12345",
      userId: "12345",
      username: "testuser",
      callbackData: "alert_A01",
      messageId: "1",
      platform: "telegram",
    };

    assetInfoCache.clear();
  });

  it("should display the alert message with button", async () => {
    // Given
    const mockAssetInfo: AssetInfo = {
      id: "A01",
      name: "Test Asset",
      renter: "Test Renter",
      amount: "1000",
      category: "Test Category",
      payment_date: "",
    };

    assetInfoCache.set(mockAssetInfo.id, mockAssetInfo);
    assetNameCache.set(mockAssetInfo.id, mockAssetInfo.name);
    (getAssetInfoById as jest.Mock).mockResolvedValue(mockAssetInfo);

    // When
    await AlertMessage(mockContext, mockBot);

    // Then
    expect(getAssetInfoById).toHaveBeenCalledWith(mockAssetInfo.id);
    expect(mockBot.sendMessageWithButtons).toHaveBeenCalledWith(
      mockContext.chatId,
      alertMsg(mockAssetInfo.name),
      updateNowOrLaterButton(mockAssetInfo.id),
      { parseMode: "Markdown" }
    );
    expect(assetInfoCache.has(mockAssetInfo.id)).toBe(true);
    expect(assetNameCache.has(mockAssetInfo.id)).toBe(true);
  });

  it("should send not found message when asset is undefined", async () => {
    // Given
    (getAssetInfoById as jest.Mock).mockResolvedValue(undefined);

    // When
    await AlertMessage(mockContext, mockBot);

    // Then
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      assetInfoNotFoundMsg
    );
    expect(mockBot.sendMessageWithButtons).not.toHaveBeenCalled();
  });

  it("should sent invalid format message when callback data is invalid", async () => {
    // Given
    mockContext.callbackData = "invalid_format";

    // When
    await AlertMessage(mockContext, mockBot);

    // Then
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      invalidFormatMsg
    );
    expect(mockBot.editMessage).not.toHaveBeenCalled();
    expect(mockBot.sendMessageWithButtons).not.toHaveBeenCalled();
  });

  it("should send error message when error reading spreadsheet", async () => {
    // Given
    (getAssetInfoById as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    // When
    await AlertMessage(mockContext, mockBot);

    // Then
    expect(getAssetInfoById).toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      errorReadingSpreadsheetMsg
    );
  });
});
