import { IUserLeaderboard } from "@/types/leader";
import { HiBriefcase } from "react-icons/hi";

const betAmountLeaderboard = [
  {
    name: "Crash",
    color: "#80EED3",
    key: "crash",
  },
  {
    name: "CoinFlip",
    color: "#F2D07F",
    key: "coinflip"
  },
  {
    name: "Mines",
    color: "#FF868E",
    key: "mines",
  },
  {
    name: "Chrome Run",
    color: "#60DCFD",
    key: "chromeRune",
  },
  {
    name: "Rocket Rush",
    color: "#F5B6A7",
    key: "rocketRush",
  },
];

export default function TotalBetAmount({ userLeaderboard }: { userLeaderboard: IUserLeaderboard }) {
  const totalBetAmount = userLeaderboard.coinflip.betAmount + userLeaderboard.crash.betAmount + userLeaderboard.mines.betAmount + userLeaderboard.chromeRune.betAmount + userLeaderboard.rocketRush.betAmount;
  return (
    <div className="group relative flex w-6/12 cursor-pointer flex-row items-center gap-5 rounded-lg border border-black p-5 shadow-card-shadow">
      <HiBriefcase size={24} className="icon" />
      <div className="flex w-full flex-col">
        <span className="text-sm capitalize text-black">Total Bet Amount</span>
        <div className="flex flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1  uppercase text-black">
            <p className="text-lg font-semibold">
              {Number(totalBetAmount.toFixed(0)).toLocaleString()}
            </p>
            <p className="text-xs font-bold">ACME</p>
          </span>
          <span className="text-sm capitalize text-black">$ {Number(totalBetAmount.toFixed(0)).toLocaleString()}</span>
        </div>
      </div>
      <div className="absolute right-5 top-7 z-50 hidden items-center justify-center rounded-lg border border-black bg-white p-4 shadow-card-shadow transition-opacity duration-300 group-hover:inline-block">
        <div className="flex flex-col gap-2">
          {betAmountLeaderboard?.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between gap-14"
            >
              <div className="flex flex-row items-center gap-2">
                <div
                  className="h-3 w-3 border border-black"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm capitalize text-black">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-black">
                {Number(userLeaderboard[item.key]?.betAmount.toFixed(2)).toLocaleString()} $COIN
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
