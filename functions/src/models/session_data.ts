import { Context } from "telegraf";
import { AssetInfo } from "./asset_info";

interface SessionData {
  editingAssetId?: string;
  editStep?: "waiting_for_field" | "waiting_for_value";
  fieldToEdit?: keyof AssetInfo;
}
export interface BotContext extends Context {
    session: SessionData;
  }