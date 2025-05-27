import { UpdateAssetIncome } from "../../services/UpdateAssetIncome";
import { BotPlatform, CallbackContext } from "../../interfaces/BotInterface";
import {
  alertMsg,
  assetInfoDisplayMsg,
  assetInfoNotFoundMsg,
  invalidFormatMsg,
} from "../../constant/Message";
import { confirmOrEditInfoButton } from "../../constant/Button";
import { assetInfoCache } from "../../models/AssetInfo";

jest.mock("../../constant/Button");

describe("UpdateAssetIncome", () => {
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
      callbackData: "update_now_A01",
      messageId: "1",
      platform: "telegram",
    };

    assetInfoCache.clear();
  });

  it("should display the asset info with button", async () => {
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
    (confirmOrEditInfoButton as jest.Mock).mockReturnValue([
      { text: "Confirm" },
    ]);

    // When
    await UpdateAssetIncome(mockContext, mockBot);

    // Then
    expect(mockBot.editMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      mockContext.messageId,
      alertMsg(mockAssetInfo.name),
      { parseMode: "Markdown" }
    );
    expect(mockBot.sendMessageWithButtons).toHaveBeenCalledWith(
      mockContext.chatId,
      assetInfoDisplayMsg(mockAssetInfo),
      confirmOrEditInfoButton(mockAssetInfo.id),
      { parseMode: "Markdown" }
    );
  });

  it("should send not found message when asset is not from cache", async () => {
    // Given
    assetInfoCache.clear();

    // When
    await UpdateAssetIncome(mockContext, mockBot);

    // Then
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      assetInfoNotFoundMsg
    );
    expect(mockBot.editMessage).not.toHaveBeenCalled();
    expect(mockBot.sendMessageWithButtons).not.toHaveBeenCalled();
  });

  it("should sent invalid format message when callback data is invalid", async () => {
    // Given
    mockContext.callbackData = "invalid_format";

    // When
    await UpdateAssetIncome(mockContext, mockBot);

    // Then
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      invalidFormatMsg
    );
    expect(mockBot.editMessage).not.toHaveBeenCalled();
    expect(mockBot.sendMessageWithButtons).not.toHaveBeenCalled();
  });
});
