import { ConfirmMessage } from "../../services/ConfirmMessage";
import { BotPlatform, CallbackContext } from "../../interfaces/BotInterface";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  failedUpdateMsg,
  invalidFormatMsg,
  succeedUpdateMsg,
} from "../../constant/Message";
import { saveIncomeToSpreadsheet } from "../../repository/AssetInfoRepo";
import { assetInfoCache } from "../../models/AssetInfo";

jest.mock("../../repository/AssetInfoRepo");

describe("ConfirmMessage", () => {
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
      callbackData: "confirm_A01",
      messageId: "1",
      platform: "telegram",
    };

    assetInfoCache.clear();
  });

  it("should successfully update asset and send success message", async () => {
    // Given
    const mockAssetInfo = {
      id: "A01",
      name: "Test Asset",
      renter: "Test Renter",
      amount: "1000",
      category: "Test Category",
      payment_date: "",
    };

    assetInfoCache.set(mockAssetInfo.id, mockAssetInfo);
    (saveIncomeToSpreadsheet as jest.Mock).mockResolvedValue(true);

    // When
    await ConfirmMessage(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      mockContext.messageId,
      assetInfoDisplayMsg(mockAssetInfo)
    );
    expect(saveIncomeToSpreadsheet).toHaveBeenCalledWith(mockAssetInfo);
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      succeedUpdateMsg(mockAssetInfo.name)
    );
  });

  it("should send not found message when asset is not in cache", async () => {
    // Given
    assetInfoCache.clear();

    // When
    await ConfirmMessage(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).not.toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      assetInfoNotFoundMsg
    );
  });

  it("should send invalid format message when callback data is invalid", async () => {
    // Given
    mockContext.callbackData = "invalid_format";

    // When
    await ConfirmMessage(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).not.toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      invalidFormatMsg
    );
  });

  it("should send error message when save to spreadsheet fail", async () => {
    // Given
    const mockAssetInfo = {
      id: "A01",
      name: "Test Asset",
      renter: "Test Renter",
      amount: "1000",
      category: "Test Category",
      payment_date: "",
    };

    assetInfoCache.set(mockAssetInfo.id, mockAssetInfo);
    (saveIncomeToSpreadsheet as jest.Mock).mockResolvedValue(false);

    // When
    await ConfirmMessage(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      mockContext.messageId,
      assetInfoDisplayMsg(mockAssetInfo)
    );
    expect(saveIncomeToSpreadsheet).toHaveBeenCalledWith(mockAssetInfo);
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      failedUpdateMsg
    );
  });
});
