import VIPLevelType from "./vipLevel";

export interface IToken {
  name: string;
  src: string;
  token: string;
}
export interface IGameStateType {
  _id: string;
  status: number;
  crashPoint: number | null;
  startedAt: Date | null;
  duration: number | null;
  players: { [key: string]: IBetType };
  pending: { [key: string]: IPendingBetType };
  pendingCount: number;
  pendingBets: IPendingBetType[];
  privateSeed: string | null;
  privateHash: string | null;
  publicSeed: string | null;
  createdAt?: Date;
}

export interface IBetType {
  playerID: string;
  username: string;
  avatar?: string;
  betAmount: number;
  status: number;
  level: VIPLevelType;
  stoppedAt?: number;
  autoCashOut?: number;
  winningAmount?: number;
  forcedCashout?: boolean;
  createdAt?: Date;
  token: string;
  autobet?: boolean;
}

export interface IPendingBetType {
  betAmount: number;
  autoCashOut?: number;
  username: string;
  token: string;
}

export type TFormattedPlayerBetType = Pick<
  IBetType,
  | "playerID"
  | "username"
  | "avatar"
  | "betAmount"
  | "status"
  | "level"
  | "stoppedAt"
  | "winningAmount"
  | "token"
  | "autobet"
>;

export interface IFormattedGameHistoryType
  extends Pick<
    IGameStateType,
    | "_id"
    | "privateHash"
    | "privateSeed"
    | "publicSeed"
    | "crashPoint"
    | "createdAt"
  > {}

interface ILevelInfo {
  name: string;
  wagerNeeded: number;
  rakebackPercentage: number;
  levelName: string;
  levelColor: string;
}

interface IPlayerInfo {
  autoCashOut: number;
  betAmount: number;
  createdAt: string;
  playerID: string;
  username: string;
  avatar: string;
  level: ILevelInfo;
  status: number;
  forcedCashout: boolean;
  stoppedAt?: number;
  winningAmount?: number;
}

export interface ICrashHistoryData {
  _id: string;
  players: { [key: string]: IPlayerInfo };
  crashPoint: number;
}

export interface IAutoCrashGameData {
  betAmount: number;
  token: string;
  cashoutPoint: number;
  count: number;
}

export interface ICrashGameBetJoinData {
  target: number;
  betAmount: number;
  token: string;
}

export interface IAutoCrashGameBetJoinData {
  cashoutPoint: number;
  count: number;
  betAmount: number;
  token: string;
}
