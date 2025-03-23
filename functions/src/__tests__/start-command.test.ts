import { describe, expect, it } from "@jest/globals";
import "../index";
import { startHandler } from "../handlers/handles";

describe("Start Command", () => {
  it("should reply with message when /start command is received", async () => {
    const ctx = {
      reply: jest.fn(),
    };
    await startHandler(ctx);
    expect(ctx.reply).toHaveBeenCalledWith("🚀 Bot ready to use. Try /test");
  });
});
