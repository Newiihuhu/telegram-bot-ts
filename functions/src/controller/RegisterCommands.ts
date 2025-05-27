import { BotPlatform } from "../interfaces/BotInterface";
import { HelpMessage } from "../services/HelpMessage";
import { AssetList } from "../services/AssetsList";
import { ConfirmMessage } from "../services/ConfirmMessage";
import { CancelMessage } from "../services/CancelMessage";
import { AlertMessage } from "../services/AlertMessage";
import { StartMessage } from "../services/StartMessage";
import { UpdateAssetIncome } from "../services/UpdateAssetIncome";

export function RegisterCommands(bot: BotPlatform) {
  bot.handleCommand("start", (context) => StartMessage(context, bot));

  bot.handleCommand("help", (context) => HelpMessage(context, bot));
  bot.handleCommand("all_assets", (context) => AssetList(context, bot));

  bot.handleCommand("alert", (context) => AlertMessage(context, bot));

  bot.handleCallbackQuery("^alert_A04", (context) =>
    AlertMessage(context, bot)
  );

  bot.handleCallbackQuery("^update_now_[A-Z]\\d{2}$", (context) =>
    UpdateAssetIncome(context, bot)
  );
  bot.handleCallbackQuery("^confirm_[A-Z]\\d{2}$", (context) =>
    ConfirmMessage(context, bot)
  );
  bot.handleCallbackQuery("^cancel_[A-Z]\\d{2}$", (context) =>
    CancelMessage(context, bot)
  );
}
