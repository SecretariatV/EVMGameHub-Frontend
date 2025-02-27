import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { leaderboardActions } from "@/store/redux/actions";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { getUserRandomAvatar } from "@/utils/utils";
// import { prizeMultiple } from "@/constants/data";

const leaderboardTabs = [
  { title: "Crash", value: "crash" },
  { title: "Coinflip", value: "coinflip" },
  { title: "Mines", value: "mines" },
];

const LeaderboardCard = ({ active }: { active: string }) => {
  const leaderboardState = useAppSelector((state: any) => state.leaderboard);
  return (
    <ScrollArea className="h-88 w-full overflow-x-auto">
      <div className="w-full min-w-[400px]">
        <div className="flex flex-col gap-3">
          {leaderboardState?.leaderboardHistory?.[active]?.map(
            (score, index) => {
              return (
                <div
                  key={index}
                  className="flex w-full cursor-pointer select-none flex-row items-center justify-between gap-5 border border-black px-4 py-2 shadow-btn-shadow hover:bg-primary"
                >
                  <div className="flex w-full flex-row items-center">
                    <div className="flex w-1/12 items-center justify-center gap-2">
                      {index + 1 <= 3 ? (
                        <div className="flex flex-row items-center gap-1">
                          <span className="font-secondary text-lg font-bold">
                            {index + 1 === 1
                              ? "🥇"
                              : index + 1 === 2
                                ? "🥈"
                                : "🥉"}
                          </span>
                          <span className="font-secondary text-lg font-bold">
                            {index + 1}
                          </span>
                        </div>
                      ) : (
                        <span className="font-secondary text-lg font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex w-8/12 flex-row items-center gap-2">
                      <img
                        src={getUserRandomAvatar(score.username)}
                        className="h-8 w-8 border border-black shadow-card-shadow"
                      />
                      <span className="font-secondary text-lg font-medium text-black">
                        {score.username}
                      </span>
                    </div>
                    <div className="flex w-3/12 flex-row items-center justify-end gap-2">
                      <img src={"/assets/flag.svg"} className="h-6 w-6" />
                      <span className="flex items-center gap-1 text-black">
                        <p className="font-primary text-lg font-medium">
                          {score.leaderboard?.[active]?.[
                            "acme"
                          ].betAmount.toFixed(2) ?? 0}
                        </p>
                        <p className="text-xs font-bold">ACME</p>
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default function LeaderboardSection() {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(leaderboardTabs[0].value);

  useEffect(() => {
    dispatch(leaderboardActions.subscribeLeaderboardServer());
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex w-full flex-col items-stretch gap-8 p-12">
        <div className="flex items-center justify-between">
          <h1 className="font-primary text-2xl uppercase">Leaderboard</h1>
          <div className="flex items-center gap-2 bg-transparent">
            {leaderboardTabs?.map((item, index) => (
              <button
                key={index}
                onClick={() => setActive(item.value)}
                className={`border border-black bg-dark-blue px-6 py-2 font-secondary text-sm capitalize text-black  ${active === item.value ? "bg-primary shadow-btn-shadow-active" : "bg-white shadow-btn-shadow"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-secondary text-base">User</span>
              <span className="font-secondary text-base">Score</span>
            </div>
            <LeaderboardCard active={active} />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
