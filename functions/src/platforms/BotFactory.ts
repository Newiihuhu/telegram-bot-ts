import { BotPlatform } from "../interfaces/BotInterface";
import { TelegramBotAdapter } from "./TelegramAdapter";

export type BotType = "telegram";

export class BotFactory {
  static createBot(type: BotType, token: string): BotPlatform {
    switch (type) {
      case "telegram":
        return new TelegramBotAdapter(token);
      default:
        throw new Error(`Unsupported bot type: ${type}`);
    }
  }
}
