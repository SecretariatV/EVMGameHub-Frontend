export const isProduction = import.meta.env.VITE_BASE_NETWORK === "mainnet";

export const CSERVER_URL = import.meta.env.VITE_SERVER_URL;

export enum EFilterDate {
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export const dateFilter = [
  { title: "1H", value: EFilterDate.hour },
  { title: "Day", value: EFilterDate.day },
  { title: "Week", value: EFilterDate.week },
  { title: "Month", value: EFilterDate.month },
  { title: "Year", value: EFilterDate.year },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number;
  latitude?: number;
  job: string;
  profile_picture?: string | null;
};

export const CBetMode = ["manual", "auto"];

export const multiplerArray = [2, 4, 8];

export const minesMultiplerArray = [
  {
    value: 100,
    unit: "+",
  },
  {
    value: 500,
    unit: "+",
  },
  {
    value: 1000,
    unit: "+",
  },

  {
    value: 2000,
    unit: "+",
  },
  {
    value: 5000,
    unit: "+",
  },
  {
    value: 1 / 2,
    unit: "x",
  },
  {
    value: 2,
    unit: "x",
  },
  {
    value: "max",
    unit: "",
  },
];

export const roundArray = [5, 10, 25, 50, 10000];

export const minesAmountPresets = [1, 3, 5, 10, 24];

export const minesImageSrc = ["mystery", "star", "bomb"];

export function createBooleanArray(length: number, value: boolean): boolean[] {
  return Array(length).fill(value);
}

export const defaultMine = createBooleanArray(25, true);

export const coinSide = [false, true];

export const coinFlipPresets = [
  { value: "1:0", label: "custom", multiplier: "" },
  { value: "10:5", label: "10:5 (x1.57)", multiplier: "x1.57" },
  { value: "1:1", label: "1:1 (x1.96)", multiplier: "x1.96" },
  { value: "4:3", label: "4:3 (x3.14)", multiplier: "x3.14" },
  { value: "6:5", label: "6:5 (x8.96)", multiplier: "x8.96" },
  { value: "9:8", label: "9:8 (x50.18)", multiplier: "x50.18" },
  { value: "10:10", label: "10:10 (x1003.52)", multiplier: "x1003.52" },
];

export interface IToken {
  name: string;
  src: string;
}

export const token: Array<IToken> = [
  {
    name: "acme",
    src: "/assets/tokens/acme.png",
  },
];

export type TokenBalances = {
  acme: number;
};

export const initialBalance = { acme: 0 };

export const finance = ["Deposit", "Withdraw"];

export const crashInfoSections = [
  {
    title: "1. Place Your Bet",
    steps: [
      "• Before the Crash Car gets rolling, enter the amount you want to bet in ACME.",
      "• Confirm your bet and get ready for the launch!",
    ],
  },
  {
    title: "2. Watch the Crash Car",
    steps: [
      "• As the Car takes off from the starting line, the multiplier value (your potential winnings) will keep increasing.",
      "• Watch as the multiplier climbs higher and higher.",
    ],
  },
  {
    title: "3. Cash Out",
    steps: [
      "• Decide when to cash out by clicking the cash-out button.",
      "• If you cash out before the Car crashes, you win your bet multiplied by the current multiplier value.",
      "• For example, if you bet $10 and cash out at a 3x multiplier, you’ll receive $30 (minus fees)",
    ],
  },
  {
    title: "4. Crash",
    steps: [
      "• If the Car crashes before you cash out, you lose your bet.",
      "• The key is to balance risk and reward—cash out too early, and you might miss bigger winnings; wait too long, and you risk losing it all.",
    ],
  },
];

export const casinoGameSrc = [
  {
    title: "crash",
    bgColor: "#81eed3",
    href: "/crash",
    logoImage: "/assets/home/crash-icon.svg",
    shortDescription: "Crash Game",
    starLogo: "/assets/home/star.svg",
    cloudLogo: "/assets/home/cloud1.svg",
    description:
      "Crash games are a category of game that define all Bitcoin casinos and separate them from traditional iGaming sites.",
  },
  {
    title: "coinflip",
    bgColor: "#ECC576",
    href: "/coin-flip",
    logoImage: "/assets/home/coinflip-icon.svg",
    shortDescription: "Flip your life",
    description:
      "Coinflip games are a category of game that define all Bitcoin casinos and separate them from traditional iGaming sites.",
  },
  {
    title: "mines",
    bgColor: "#F58A8A",
    href: "/mines",
    logoImage: "/assets/home/mines-icon.svg",
    shortDescription: "Play & Get Bonus Bomb!",
    description:
      "Mines games are a category of game that define all Bitcoin casinos and separate them from traditional iGaming sites.",
  },
];

export const minigameSrc = [
  {
    title: "desert run",
    bgColor: "#5ddbfd",
    href: "/desert-run",
    logoImage: "/assets/home/desert.svg",
    shortDescription: "Desert Run",
    description:
      "Rush up to the sky in a rocket. Just play online, no download or installation required.",
  },
  {
    title: "rocket rush",
    bgColor: "#c87f6f",
    href: "/rocket-rush",
    logoImage: "/assets/home/rocket.svg",
    shortDescription: "Rocket Rush",
    starLogo: "/assets/home/star.svg",
    cloudLogo: "/assets/home/cloud2.svg",
    description:
      "Rush up to the sky in a rocket. Just play online, no download or installation required.",
  },
];

export const gameLists = [
  // { name: "total", color: "white" },
  { name: "crash", color: "#0BA544", value: 2 },
];

export const adminWallets = [
  "0x6Dd7EBC6cff6D4f4F09C9A06EA18f95C6321a2eE",
  "0x736d51C8938581292778A6bA9Dc61f0E29D660f6",
];

export const CCrashGame_Msg = {
  autobet_running: "Autobet is running.",
  autobet_canceled: "Autobet has been canceled.",
  autobet_reached_max:
    "Autobet has reached the max number of bets! Autobet has canceled",
  autobet_not_enough_balance:
    "You can't afford this autobet! Autobet has canceled",
};

export const token_currency = {
  acme: 0.016,
};

export const prizeMultiple: number = 0.6;

export enum ERevenueType {
  TOTAL = 0,
  COINFLIP = 1,
  CRASH = 2,
  MINE = 3,
}

export const CONETIME_LIMIT = {
  acme: 3000,
};

export const casino_game_list = ["crash", "coinflip", "mines"];

export const minigame_list = ["desert run", "rocket rush"];

export const CCrashGameScreen = {
  width: 940,
  height: 450,
};

export enum EHistoryType {
  BETTING = "betting",
  WITHDRAW = "withdrawl",
  DEPOSIT = "deposit",
}

