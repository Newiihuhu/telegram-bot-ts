import {
  BotPlatform,
  Button,
  CallbackContext,
  CommandContext,
  MessageOptions,
  UserMessageContext,
} from "../interfaces/BotInterface";
import { Telegraf } from "telegraf";
import { Context } from "telegraf";

export class TelegramBotAdapter implements BotPlatform {
  private bot: Telegraf;

  constructor(token: string) {
    this.bot = new Telegraf(token);
  }

  async handleWebhookUpdate(update: any): Promise<void> {
    await this.bot.handleUpdate(update);
  }

  async sendMessage(
    chatId: string,
    message: string,
    options?: MessageOptions
  ): Promise<void> {
    try {
      await Promise.race([
        this.bot.telegram.sendMessage(chatId, message, {
          parse_mode: options?.parseMode,
          disable_web_page_preview: options?.disableWebPagePreview,
        } as any),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        ),
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async sendMessageWithButtons(
    chatId: string,
    message: string,
    buttons: Button[][],
    options?: MessageOptions
  ): Promise<void> {
    const inlineKeyboard = buttons.map((row) =>
      row.map((button) => {
        const buttonData: any = { text: button.text };
        if (button.callback_data) {
          buttonData.callback_data = button.callback_data;
        }
        if (button.url) {
          buttonData.url = button.url;
        }
        return buttonData;
      })
    );

    await this.bot.telegram.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard: inlineKeyboard },
      parse_mode: options?.parseMode,
      disable_web_page_preview: options?.disableWebPagePreview,
    } as any);
  }

  async editMessage(
    chatId: string,
    messageId: string,
    newMessage: string,
    options?: MessageOptions
  ): Promise<void> {
    await this.bot.telegram.editMessageText(
      chatId,
      parseInt(messageId),
      undefined,
      newMessage,
      {
        parse_mode: options?.parseMode,
        disable_web_page_preview: options?.disableWebPagePreview,
      } as any
    );
  }

  async handleCommand(
    command: string,
    handler: (context: CommandContext) => Promise<void>
  ): Promise<void> {
    this.bot.command(command, async (ctx: Context) => {
      const commandContext: CommandContext = {
        chatId: ctx.chat?.id.toString() ?? "",
        userId: ctx.from?.id.toString() ?? "",
        username: ctx.from?.username ?? "",
        message: (ctx.message as any)?.text ?? "",
        parameters: (ctx.message as any)?.text?.split(" ").slice(1) ?? [],
        platform: "telegram",
        messageId: ctx.message?.message_id.toString() ?? "",
      };
      await handler(commandContext);
    });
  }

  async handleCallbackQuery(
    pattern: string,
    handler: (context: CallbackContext) => Promise<void>
  ): Promise<void> {
    this.bot.action(new RegExp(pattern), async (ctx: Context) => {
      const callbackContext: CallbackContext = {
        chatId: ctx.chat?.id.toString() ?? "",
        userId: ctx.from?.id.toString() ?? "",
        username: ctx.from?.username ?? "",
        callbackData: (ctx.callbackQuery as any)?.data ?? "",
        messageId:
          (ctx.callbackQuery as any)?.message?.message_id.toString() ?? "",
        platform: "telegram",
      };
      await handler(callbackContext);
    });
  }

  async handleUserMessage(
    handler: (context: UserMessageContext) => Promise<void>
  ): Promise<void> {
    this.bot.on("message", async (ctx: Context) => {
      const userMessageContext: UserMessageContext = {
        chatId: ctx.chat?.id.toString() ?? "",
        userId: ctx.from?.id.toString() ?? "",
        message: (ctx.message as any)?.text ?? "",
        platform: "telegram",
        messageId: ctx.message?.message_id.toString() ?? "",
      };
      await handler(userMessageContext);
    });
  }

  async start(): Promise<void> {
    // Delete any existing webhook before launching
    await this.bot.telegram.deleteWebhook();
    await this.bot.launch();
  }

  async stop(): Promise<void> {
    this.bot.stop();
  }
}
