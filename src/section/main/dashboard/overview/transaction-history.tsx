import { Icon } from "@/components/icon";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import axiosInstance from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import { useEffect, useState } from "react";


const gameTxOverview = [
  {
    game: "Crash",
    key: "crash",
    icon: <Icon name="Crash" width={21} height={21} viewBox="0 0 21 21" />,
  },
  {
    game: "Coinflip",
    key: "coinflip",
    icon: <Icon name="Flip" width={21} height={21} viewBox="0 0 21 21" />,
  },
  {
    game: "Mines",
    key: "mine",
    icon: <Icon name="Bomb" width={21} height={21} viewBox="0 0 21 21" />,
  },
  {
    game: "Rocket Rush",
    key: "rocketRush",
    icon: <Icon name="Rush" width={21} height={21} viewBox="0 0 21 21" />,
  },
  {
    game: "Desert Run",
    key: "chromeRun",
    icon: <Icon name="Chrome" width={21} height={21} viewBox="0 0 21 21" />,
  },
];

const TransactionHistoryCard = () => {
  const [gameTxHistory, setGameTxHistory] = useState<any>([]);

  const fetchTransactionHistory = async () => {
    const response = await axiosInstance.post(
      `${BACKEND_API_ENDPOINT.dashboard.history}?type=betting&page=1&limit=5`
    );
    setGameTxHistory(response?.data?.items);
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);


  return (
    <ScrollArea className="h-88 w-full overflow-x-auto">
      <div className="w-full min-w-[400px]">
        <div className="flex flex-col gap-3">
          {gameTxHistory?.map((item, index) => {
            return (
              <div
                key={index}
                className="flex w-full cursor-pointer select-none flex-row items-center justify-between gap-5 border border-black px-4 py-2 shadow-btn-shadow hover:bg-primary"
              >
                <div className="flex w-full flex-row items-center">
                  <div className="flex w-3/12 flex-row items-center gap-2">
                    {gameTxOverview.find((game) => item?.first === game.key)?.icon}
                    <span className="font-secondary text-base text-black">
                      {gameTxOverview.find((game) => item?.first === game.key)?.game}
                    </span>
                  </div>
                  <span className="w-3/12 font-secondary text-base text-black">
                    {item?.second}
                  </span>
                  <span className="w-3/12 font-secondary text-base text-black">
                    {new Date(item?.third).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <span className="flex w-3/12 items-center justify-end gap-1 text-black">
                    <p className="font-secondary text-base">
                      {item?.fourth}
                    </p>
                    <p className="text-xs font-bold">ACME</p>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default function TransactionHistory() {
  return (
    <div className="flex w-full flex-col gap-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-primary text-xl uppercase">Recent Transactions</h1>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between p-3">
            <span className="w-3/12 font-secondary text-base font-medium">Game</span>
            <span className="w-3/12 font-secondary text-base font-medium">Transaction Type</span>
            <span className="w-3/12 font-secondary text-base font-medium">Transaction Date</span>
            <span className="w-3/12 text-end font-secondary text-base font-medium">
              Amount
            </span>
          </div>
          <ScrollArea className="h-[400px] w-full p-3">
            <TransactionHistoryCard />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
