export interface AssetInfo {
  id: string;
  name: string;
  category: string;
  renter: string;
  amount: string;
  payment_date: string;
  updated_at?: string;
}

export const assetInfoCache = new Map<string, AssetInfo>();

export const assetInfoListCache = new Map<string, AssetInfo[]>();

export const assetNameCache = new Map<string, string>();
