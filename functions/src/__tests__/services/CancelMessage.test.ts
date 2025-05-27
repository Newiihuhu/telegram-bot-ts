import { CancelMessage } from "../../services/CancelMessage";
import { BotPlatform, CallbackContext } from "../../interfaces/BotInterface";
import {
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  cancelUpdateMsg,
  invalidFormatMsg,
} from "../../constant/Message";
import { assetInfoCache } from "../../models/AssetInfo";

describe("CancelMessage", () => {
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
      callbackData: "cancel_A01",
      messageId: "1",
      platform: "telegram",
    };

    assetInfoCache.clear();
  });

  it("should send cancel message", async () => {
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

    // When
    await CancelMessage(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      mockContext.messageId,
      assetInfoDisplayMsg(mockAssetInfo)
    );
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      cancelUpdateMsg
    );
    expect(assetInfoCache.has(mockAssetInfo.id)).toBe(false);
  });

  it("should send not found message when asset is not from cache", async () => {
    // Given
    assetInfoCache.clear();

    // When
    await CancelMessage(mockContext, mockBot);

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
    await CancelMessage(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).not.toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      invalidFormatMsg
    );
  });
});
