import { ScrollArea } from "@/components/ui/scroll-area";
import TotalBonus from "../overview/total-bonus";
import TotalBetAmount from "../overview/total-betAmount";
import TransactionHistory from "../overview/transaction-history";
import { Icon } from "@/components/icon";
import { useEffect, useState } from "react";
import { IUserLeaderboard } from "@/types/leader";
import axiosInstance from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";

const casinoGames = [
  { game: "Crash", icon: "Crash", color: "#80EED3", key: "crash" },
  { game: "Coinflip", icon: "Flip", color: "#F2D07F", key: "coinflip" },
  { game: "Mines", icon: "Bomb", color: "#FF868E", key: "mines" },
];

const miniGames = [
  {
    game: "Desert Run",
    icon: "Chrome",
    color: "#60DCFD",
    bestScore: 2800,
    key: "chromeRune",
  },
  {
    game: "Rokect Rush",
    icon: "Rush",
    color: "#F5B6A7",
    bestScore: 2800,
    key: "rocketRush",
  },
];

export default function DashboardProfitLossSection() {

  const [userLeaderboard, setUserLeaderboard] = useState<IUserLeaderboard>({
    coinflip: { betAmount: 0, winAmount: 0 },
    crash: { betAmount: 0, winAmount: 0 },
    mines: { betAmount: 0, winAmount: 0 },
    chromeRune: { betAmount: 0, winAmount: 0 },
    rocketRush: { betAmount: 0, winAmount: 0 },
  });

  const fetchUserLeaderBoard = async () => {
    function extractGameData(response, gameType) {
      const gameData = response?.data?.data?.[gameType]?.acme;
      return {
        betAmount: gameData?.betAmount ?? 0,
        winAmount: gameData?.winAmount ?? 0
      };
    }

    const response = await axiosInstance.post(
      BACKEND_API_ENDPOINT.dashboard.leaderboard
    );

    // Use the helper function to set user leaderboard data
    setUserLeaderboard({
      coinflip: extractGameData(response, 'coinflip'),
      crash: extractGameData(response, 'crash'),
      mines: extractGameData(response, 'mines'),
      chromeRune: extractGameData(response, 'chromeRune'),
      rocketRush: extractGameData(response, 'rocketRush'),
    });
  };

  useEffect(() => {
    fetchUserLeaderBoard();
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex w-full flex-col gap-4 p-12">
        <div className="flex w-full flex-col gap-10">
          <div className="flex flex-row gap-5">
            <TotalBetAmount userLeaderboard={userLeaderboard} />
            <TotalBonus userLeaderboard={userLeaderboard} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="font-primary text-xl uppercase">Casino Games</h1>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {casinoGames?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center gap-5 rounded-lg border border-black px-4 py-2 shadow-card-shadow"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      name={item.icon as any}
                      width={50}
                      height={50}
                      viewBox="0 0 21 21"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-secondary text-lg capitalize text-black">
                      {item.game}
                    </span>
                    <span className="font-secondary text-xl font-semibold text-black">
                      {Number((userLeaderboard[item.key].winAmount - userLeaderboard[item.key].betAmount).toFixed(2)).toLocaleString()} $COIN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="font-primary text-xl uppercase">Mini Games</h1>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {miniGames?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-start gap-5 rounded-lg border border-black px-4 py-2 shadow-card-shadow"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      name={item.icon as any}
                      width={50}
                      height={50}
                      viewBox="0 0 21 21"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-3">
                    <span className="font-secondary text-lg capitalize text-black">
                      {item.game}
                    </span>
                    <span className="font-secondary text-xl font-semibold text-black">
                      {Number((userLeaderboard[item.key].winAmount - userLeaderboard[item.key].betAmount).toFixed(2)).toLocaleString()} $COIN
                    </span>
                    <div className="flex w-full flex-row items-center justify-between rounded-lg border border-black bg-white px-4 py-3">
                      <div className="flex flex-row items-center gap-1">
                        <div
                          className="h-2.5 w-2.5 border border-black"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-secondary text-black">
                          Best Score
                        </span>
                      </div>
                      <span className="font-secondary font-semibold text-black">
                        {item.bestScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full gap-5">
            <TransactionHistory />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
