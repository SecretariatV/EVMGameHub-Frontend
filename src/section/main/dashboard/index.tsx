import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardChart from "./chart";
import InvitedFriends from "/assets/home/invite.png";
import { useEffect, useState } from "react";
import {
  CSERVER_URL,
  EFilterDate,
  ERevenueType,
  TokenBalances,
  dateFilter,
  initialBalance,
} from "@/constants/data";
import TransactionHistory from "./overview/transaction-history";
import { Button } from "@/components/ui/button";
import TotalBonus from "./overview/total-bonus";
import TotalBetAmount from "./overview/total-betAmount";
import axiosInstance from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import { IUserLeaderboard } from "@/types/leader";

export default function DashboardSection() {
  const [adminWallet, setAdminWallet] = useState<TokenBalances>(initialBalance);
  const [filterDate, setFilterDate] = useState<EFilterDate>(EFilterDate.hour);
  const [revenueType, setRevenueType] = useState<ERevenueType>(
    ERevenueType.TOTAL
  );
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
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-row gap-5">
            <TotalBetAmount userLeaderboard={userLeaderboard} />
            <TotalBonus userLeaderboard={userLeaderboard} />
          </div>
          <Card className="h-[500px] w-full border-black bg-opacity-80 p-10 shadow-card-shadow">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-3">
                <h1 className="text-2xl font-semibold text-black">Overview</h1>
              </div>
              <div className="flex flex-row gap-5">
                {dateFilter.map((date, index) => (
                  <button
                    key={index}
                    className={`border border-black px-2 py-1 font-secondary text-sm text-black shadow-btn-shadow ${filterDate === date.value ? "bg-primary shadow-btn-shadow-active" : "bg-transparent"}`}
                    onClick={() => setFilterDate(date.value)}
                  >
                    {date.title}
                  </button>
                ))}
              </div>
            </div>
            <DashboardChart date={filterDate} revenueType={revenueType} />
          </Card>
          <div className="flex w-full gap-5">
            <TransactionHistory />
          </div>
          <div className="flex w-full flex-row gap-6 rounded-xl border-2 border-black">
            <div className="relative w-full">
              <img
                src={InvitedFriends}
                alt="Banner Image"
                className="aspect-auto w-full rounded-lg"
              />
              <div className="absolute top-0 flex h-full w-full flex-col items-start justify-center gap-4 p-10">
                <h2 className="max-w-[450px] font-primary text-3xl font-bold uppercase leading-10 text-white">
                  Invite Your Friends
                </h2>
                <p className="text-center font-secondary text-lg leading-7 text-white">
                  Join the Affiliate and get reward up to $100.
                </p>
                <Button className="active-card-shadow border border-black bg-white px-6 py-4 font-primary text-xl text-black">
                  Invite Friends
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
