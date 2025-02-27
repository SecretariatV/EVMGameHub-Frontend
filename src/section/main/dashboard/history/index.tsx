import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import BettingHistory from "./betting-history";
import { EHistoryType } from "@/constants/data";


export default function DashboardHistorySection() {
  const [active, setActive] = useState(EHistoryType.BETTING);
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex w-full flex-col items-stretch gap-8 p-12">
        <div className="flex items-center justify-between">
          <h1 className="font-primary text-2xl uppercase">History</h1>
          <div className="flex items-center gap-2 bg-transparent">
            {Object.values(EHistoryType).map((item, index) => (
              <button
                key={index}
                onClick={() => setActive(item)}
                className={`border border-black bg-dark-blue px-6 py-2 font-secondary text-base font-medium capitalize text-black  ${active === item ? "bg-primary shadow-btn-shadow-active" : "bg-white shadow-btn-shadow"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <BettingHistory historyType={active} />
        </div>
      </div>
    </ScrollArea>
  );
}
