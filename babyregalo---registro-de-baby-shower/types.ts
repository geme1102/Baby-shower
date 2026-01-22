
export interface Gift {
  id: string;
  name: string;
  description: string;
  category: string;
  isClaimed: boolean;
  claimedBy?: string;
}

export enum ViewMode {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN'
}

export interface AppSettings {
  babyName: string;
  hostPhone: string;
}

export interface AppState {
  gifts: Gift[];
  settings: AppSettings;
}
