import { AssetList } from "../../services/AssetsList";
import { BotPlatform, CommandContext } from "../../interfaces/BotInterface";
import {
  assetInfoListDisplayMsg,
  assetInfoNotFoundMsg,
  errorReadingSpreadsheetMsg,
} from "../../constant/Message";
import { getAllAssetInfo } from "../../repository/AssetInfoRepo";
import { AssetInfo } from "../../models/AssetInfo";

jest.mock("../../repository/AssetInfoRepo");

describe("AssetList", () => {
  let mockBot: jest.Mocked<BotPlatform>;
  let mockContext: CommandContext;

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
      message: "test message",
      parameters: [],
      platform: "telegram",
    };
  });

  it("should display asset list", async () => {
    // Given
    const mockAssetList: AssetInfo[] = [
      {
        id: "A01",
        name: "Asset 1",
        renter: "Renter 1",
        amount: "1000",
        category: "Category 1",
        payment_date: "",
      },
      {
        id: "A02",
        name: "Asset 2",
        renter: "Renter 2",
        amount: "2000",
        category: "Category 2",
        payment_date: "",
      },
    ];

    (getAllAssetInfo as jest.Mock).mockResolvedValue(mockAssetList);

    // When
    await AssetList(mockContext, mockBot);

    // Then
    expect(getAllAssetInfo).toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      assetInfoListDisplayMsg(mockAssetList)
    );
  });

  it("should send not found message when assets are empty", async () => {
    // Given
    (getAllAssetInfo as jest.Mock).mockResolvedValue([]);

    // When
    await AssetList(mockContext, mockBot);

    // Then
    expect(getAllAssetInfo).toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      assetInfoNotFoundMsg
    );
  });

  it("should send error message when error reading spreadsheet", async () => {
    // Given
    (getAllAssetInfo as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    // When
    await AssetList(mockContext, mockBot);

    // Then
    expect(getAllAssetInfo).toHaveBeenCalled();
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      errorReadingSpreadsheetMsg
    );
  });
});
