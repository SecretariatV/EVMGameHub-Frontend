export interface DashboardType {
  coinflip: any;
  crash: any;
}

export enum EDashboardSocketEvent {
  GET_DASHBOARD_HISTORY = "dashboard-fetch-all",
  GET_TOP_PLAYERS = "dashboard-top-players",
}

export interface IDashboardClientToServerEvents { }
export interface IDashboardServerToClientEvents {
  [EDashboardSocketEvent.GET_DASHBOARD_HISTORY]: (data: {
    message: string;
    dashboard: DashboardType;
  }) => void;
  [EDashboardSocketEvent.GET_TOP_PLAYERS]: (data: {
    message: string;
    topPlayers: DashboardType;
  }) => void;
}

export type THistoryType = {
  first: string;
  second: string;
  third: string;
  fourth: string;
}