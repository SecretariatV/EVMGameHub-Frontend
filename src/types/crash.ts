import {
  IFormattedGameHistoryType,
  TFormattedPlayerBetType,
  IBetType,
  ICrashHistoryData,
  IAutoCrashGameData,
} from "./crash-game";

export enum ECrashSocketEvent {
  LOGIN_GAME = "auth",
  GAME_BETS = "game-bets",
  GAME_STARTING = "game-starting",
  GAME_START = "game-start",
  BET_CASHOUT = "bet-cashout",
  GAME_END = "game-end",
  GAME_TICK = "game-tick",
  JOIN_CRASH_GAME = "join-crash-game",
  CRASHGAME_JOIN_SUCCESS = "crashgame-join-success",
  AUTO_CRASHGAME_BET = "auto-crashgame-bet",
  AUTO_CRASHGAME_BET_CASHOUT = "cancel-auto-bet",
  PREVIOUS_CRASHGAME_HISTORY = "previous-crashgame-history",
  GAME_JOIN_ERROR = "game-join-error",
  BET_CASHOUT_ERROR = "bet-cashout-error",
  BET_CASHOUT_SUCCESS = "bet-cashout-success",
  AUTO_CRASHGAME_JOIN_SUCCESS = "auto-crashgame-join-success",
  GAME_STATUS = "game-status",
  UPDATE_WALLET = "update-wallet",
  CRASH_AUTO_BET_COUNT_MAX = "crash-autobet-count-max",
  CRASH_AUTO_BET_BALANCE_ERROR = "crash-autobet-balance-error",
}

export interface ICrashServerToClientEvents {
  [ECrashSocketEvent.GAME_BETS]: (bets: TFormattedPlayerBetType[]) => void;
  [ECrashSocketEvent.UPDATE_WALLET]: (
    walletValue: number,
    token: string
  ) => void;
  [ECrashSocketEvent.GAME_STARTING]: (data: {
    _id: string | null;
    privateHash: string | null;
    timeUntilStart?: number;
  }) => void;
  [ECrashSocketEvent.GAME_START]: (data: { publicSeed: string }) => void;
  [ECrashSocketEvent.BET_CASHOUT]: (data: {
    userdata: IBetType;
    status: number;
    stoppedAt: number | undefined;
    winningAmount: number;
  }) => void;
  [ECrashSocketEvent.GAME_END]: (data: {
    game: IFormattedGameHistoryType;
  }) => void;
  [ECrashSocketEvent.GAME_TICK]: (data: { e: number; p: number }) => void;
  [ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS]: (
    data: TFormattedPlayerBetType
  ) => void;
  [ECrashSocketEvent.BET_CASHOUT_ERROR]: (data: string) => void;
  [ECrashSocketEvent.BET_CASHOUT_SUCCESS]: (result: any) => void;
  [ECrashSocketEvent.CRASH_AUTO_BET_COUNT_MAX]: (data: string) => void;
  [ECrashSocketEvent.CRASH_AUTO_BET_BALANCE_ERROR]: (data: string) => void;
  [ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY]: (count: number) => void;
  [ECrashSocketEvent.GAME_JOIN_ERROR]: (data: string) => void;
  [ECrashSocketEvent.JOIN_CRASH_GAME]: (
    target: number,
    betAmount: number,
    token: string
  ) => void;
  [ECrashSocketEvent.AUTO_CRASHGAME_JOIN_SUCCESS]: (data: string) => void;
  [ECrashSocketEvent.GAME_STATUS]: (data: {
    players: TFormattedPlayerBetType[];
    gameStatus: any;
  }) => void;
}

export interface ICrashClientToServerEvents {
  auth: (token: string) => void;
  [ECrashSocketEvent.JOIN_CRASH_GAME]: (
    target: number,
    betAmount: number
  ) => void;
  [ECrashSocketEvent.BET_CASHOUT]: () => void;
  [ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY]: (
    historyData: ICrashHistoryData[]
  ) => void;
  [ECrashSocketEvent.AUTO_CRASHGAME_BET]: (data: IAutoCrashGameData) => void;
}
