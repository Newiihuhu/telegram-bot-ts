export interface BotPlatform {
  sendMessage(
    chatId: string,
    message: string,
    options?: MessageOptions
  ): Promise<void>;
  sendMessageWithButtons(
    chatId: string,
    message: string,
    buttons: Button[][],
    options?: MessageOptions
  ): Promise<void>;
  editMessage(
    chatId: string,
    messageId: string,
    newMessage: string,
    options?: MessageOptions
  ): Promise<void>;

  handleCommand(
    command: string,
    handler: (context: CommandContext) => Promise<void>
  ): void;

  handleCallbackQuery(
    pattern: string,
    handler: (context: CallbackContext) => Promise<void>
  ): void;

  handleUserMessage(
    handler: (context: UserMessageContext) => Promise<void>
  ): void;

  handleWebhookUpdate(update: any): Promise<void>;

  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface MessageOptions {
  parseMode?: "Markdown" | "HTML" | "Plain";
  disableWebPagePreview?: boolean;
}

export interface Button {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface CommandContext {
  chatId: string;
  userId: string;
  username: string;
  message: string;
  parameters: string[];
  platform: string;
  messageId?: string;
}

export interface CallbackContext {
  chatId: string;
  userId: string;
  callbackData: string;
  messageId: string;
  platform: string;
  username: string;
}

export interface UserMessageContext {
  chatId: string;
  userId: string;
  message: string;
  platform: string;
  messageId?: string;
}
