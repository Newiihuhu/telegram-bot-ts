import { Telegraf } from "telegraf";
import { setupAllCommands } from "../../commands/all_commands";
import { testHandler } from "../../handlers/update_income_handler";
import { BotContext } from "../../models/session_data";
describe("setupAllCommands", () => {
  it("should register the start command", () => {
    const mockBot = {
      start: jest.fn(),
      command: jest.fn(),
    } as unknown as Telegraf<BotContext>;
    setupAllCommands(mockBot);
    expect(mockBot.start).toHaveBeenCalled();
    expect(mockBot.command).toHaveBeenCalledWith("test", testHandler);
  });
});
