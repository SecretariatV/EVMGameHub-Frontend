import { CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ECrashStatus } from "@/constants/status";
import { IBetType } from "@/types";
import { getUserRandomAvatar } from "@/utils/utils";

const BetBoard = ({
  betData,
  betCashout,
  totalAmount,
  crashStatus,
}: {
  betData: IBetType[];
  betCashout: IBetType[];
  totalAmount: any;
  crashStatus: ECrashStatus;
}) => {
  return (
    <div className="flex w-full flex-col border-l border-black p-6 md:w-7/12">
      <div className="flex flex-row items-center justify-between py-1.5">
        <span className="text-gray300 font-MS text-lg font-bold uppercase">
          {betData.length} players
        </span>
        <div className="flex flex-row gap-5">
          <span className="flex flex-row items-center gap-2">
            {/* <img src="/assets/tokens/acme.png" className="h-7 w-7" /> */}
            <p className="text-gray300 text-base font-bold">
              {totalAmount?.acme?.toFixed(2) ?? "0.00"} ACME
            </p>
          </span>
        </div>
      </div>
      <CardHeader className="text-gray500 mx-3 flex flex-row items-center justify-between border-b border-black px-0 py-2 text-base font-semibold">
        <Table className="w-full table-fixed">
          <TableBody>
            <TableRow className="!bg-transparent">
              <TableCell className="w-6/12 text-start font-secondary text-sm">
                User
              </TableCell>
              <TableCell className="w-1/6 text-center font-secondary text-sm">
                Bet
              </TableCell>
              <TableCell className="w-1/6 text-center font-secondary text-sm">
                Multiplier
              </TableCell>
              <TableCell className="w-1/6 text-center font-secondary text-sm">
                Payout
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <ScrollArea className="h-[295px] px-3 py-3">
          <div className="flex w-full flex-col gap-3">
            {betData
              ?.sort((a, b) => b.betAmount - a.betAmount)
              .map((player, index) => (
                <div
                  key={index}
                  className="flex w-full cursor-pointer select-none flex-row items-center border border-black px-4 py-2 shadow-btn-shadow"
                >
                  <div className="flex w-6/12 flex-row items-center gap-2">
                    <img
                      src={getUserRandomAvatar(player.username)}
                      className="h-8 w-8 border border-black shadow-card-shadow"
                    />
                    <span className="font-secondary text-lg font-medium text-black">
                      {player.username}
                    </span>
                  </div>
                  <div className="w-2/12 text-center">
                    <span className="flex gap-1 items-center">
                      <p>{player.betAmount}</p>{" "}
                      <p className="text-xs font-bold">ACME</p>
                    </span>
                  </div>
                  <div className="w-2/12 text-center">
                    <span>
                      {betCashout?.find(
                        (item) => item.playerID === player.playerID
                      )?.stoppedAt ? (
                        <span className="rounded-sm border border-black bg-light-green px-3 py-1">
                          {(
                            (betCashout.find(
                              (item) => item.playerID === player.playerID
                            )?.stoppedAt ?? 0) / 100
                          ).toFixed(2) + "x"}
                        </span>
                      ) : crashStatus === ECrashStatus.END ? (
                        "bang"
                      ) : (
                        "betting"
                      )}
                    </span>
                  </div>
                  <div className="w-2/12 text-center">
                    {betCashout?.find(
                      (item) => item.playerID === player.playerID
                    )?.winningAmount ? (
                      <span className="flex gap-1 items-center font-semibold text-[#049DD9]">
                        <p>
                          {(
                            betCashout?.find(
                              (item) => item.playerID === player.playerID
                            )?.winningAmount ?? 0
                          )?.toFixed(2)}
                        </p>{" "}
                        <p className="text-xs font-bold">ACME</p>
                      </span>
                    ) : crashStatus === ECrashStatus.END ? (
                      <span className="flex gap-1 items-center">
                        <p>-</p>
                        <p>{player.betAmount}</p>{" "}
                        <p className="text-xs font-bold">ACME</p>
                      </span>
                    ) : (
                      <span>betting</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </div>
  );
};

export default BetBoard;
