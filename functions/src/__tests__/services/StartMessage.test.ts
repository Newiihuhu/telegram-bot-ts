import { StartMessage } from "../../services/StartMessage";
import { BotPlatform, CommandContext } from "../../interfaces/BotInterface";
import { startMsg } from "../../constant/Message";

describe("StartMessage", () => {
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

  it("should send start message to the chat", async () => {
    // When
    await StartMessage(mockContext, mockBot);

    // Then
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      mockContext.chatId,
      startMsg
    );
  });
});
