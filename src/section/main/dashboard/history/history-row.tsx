import { Icon } from "@/components/icon";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EHistoryType } from "@/constants/data";
import { THistoryType } from "@/types/dashboard";
import { truncateString } from "@/utils/truncate";


const CBettingGameRow = {
  crash: {
    icon: <Icon name="Crash" width={21} height={21} viewBox="0 0 21 21" />,
    title: "Crash",
  },
  coinflip: {
    icon: <Icon name="Flip" width={21} height={21} viewBox="0 0 21 21" />,
    title: "Coinflip",
  },
  mine: {
    icon: <Icon name="Bomb" width={21} height={21} viewBox="0 0 21 21" />,
    title: "Mines",
  },
};

export default function HistoryRow({ items, type }: { items: THistoryType[], type: EHistoryType }) {
  return (
    <ScrollArea className="h-88 w-full overflow-x-auto">
      <div className="w-full min-w-[400px]">
        <div className="flex flex-col gap-3">
          {items?.map((item, index) => {
            return (
              <div
                key={index}
                className="flex w-full cursor-pointer select-none flex-row items-center justify-between gap-5 border border-black px-4 py-2 shadow-btn-shadow hover:bg-primary"
              >
                <div className="flex w-full flex-row items-center">
                  {
                    type === EHistoryType.BETTING ? (
                      <div className="flex w-3/12 flex-row items-center gap-2">
                        {CBettingGameRow[item.first]?.icon}
                        <span className="font-secondary text-base text-black">
                          {CBettingGameRow[item.first]?.title}
                        </span>
                      </div>
                    ) : (
                      <div className="flex w-3/12 flex-row items-center gap-2">
                        <span className="font-secondary text-base text-black">
                          {item.first}
                        </span>
                      </div>
                    )
                  }
                  <span className="w-3/12 font-secondary text-base text-black">
                    {type === EHistoryType.BETTING ? item.second : truncateString(item.second, 10, 4)}
                  </span>
                  <div className="w-3/12 text-center">
                    <span className="w-3/12 px-2 text-center font-secondary text-base text-black">
                      {new Date(item.third).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  {
                    type === EHistoryType.BETTING ? (
                      <span className="w-3/12 text-end font-secondary text-base text-black">
                        {item.fourth}
                      </span>
                    ) : (
                      <span className="w-3/12 text-end font-secondary text-base text-black hover:underline hover:underline-offset-4" onClick={() => {
                        window.open(`https://sepolia.etherscan.io/tx/${item.fourth}`, "_blank");
                      }}>
                        {truncateString(item.fourth, 10, 4)}
                      </span>
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
