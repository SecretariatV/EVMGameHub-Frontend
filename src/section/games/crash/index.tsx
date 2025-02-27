import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Socket, io } from "socket.io-client";
import { IBetType, TFormattedPlayerBetType } from "@/types";
import {
  ECrashSocketEvent,
  ICrashClientToServerEvents,
  ICrashServerToClientEvents,
} from "@/types/crash";
import { ECrashStatus } from "@/constants/status";
import { getAccessToken } from "@/utils/axios";
import useToast from "@/hooks/use-toast";
import BetBoard from "./bet-board";
import {
  multiplerArray,
  CBetMode,
  roundArray,
  token,
  CCrashGame_Msg,
  CSERVER_URL,
  CCrashGameScreen,
} from "@/constants/data";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { crashActions, userActions } from "@/store/redux/actions";
import useSound from "use-sound";
import { Slider } from "@/components/ui/slider";
import GameScene from "./game-scene";
import { IRefPhaserGame } from "@/types/scene";
import GraphicDisplay from "./graphic-display";
import { Checkbox } from "@/components/ui/checkbox";
import { End, Play, Prepare } from "./game-scene/phaser-scenes";
import { EventBus } from "@/utils/phaser";
import customParser from "socket.io-msgpack-parser";

export default function CrashGameSection() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [betData, setBetData] = useState<IBetType[]>([]);
  const [betAmount, setBetAmount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [betCashout, setBetCashout] = useState<IBetType[]>([]);
  const [avaliableBet, setAvaliableBet] = useState(false);
  const [autoBet, setAutoBet] = useState(true);
  const [autoCashoutPoint, setAutoCashoutPoint] = useState(1.05);
  const [totalAmount, setTotalAmount] = useState<any>();
  const [round, setRound] = useState(roundArray[0]);
  const [selectMode, setSelectMode] = useState(CBetMode[0]);
  const [avaliableAutoCashout, setAvaliableAutoCashout] =
    useState<boolean>(false);
  const isAutoMode = selectMode === "auto";
  const [crTick, setCrTick] = useState({ prev: 1, cur: 1 });
  const [phaserLoad, setPhaserLoad] = useState(false);

  const [sceneHeight, setSceneHeight] = useState(CCrashGameScreen.height);

  const settings = useAppSelector((store: any) => store.settings);
  const userData = useAppSelector((store: any) => store.user.userData);
  const crashGameStatus = useAppSelector((store) => store.crash);

  const [play, { stop, sound }] = useSound("/assets/audio/car_running.mp3", {
    volume: 0.5,
    loop: true,
  });

  const [playExplosion, { stop: stopExplosion, sound: explosionSound }] =
    useSound("/assets/audio/explosion.mp3", { volume: 0.25 });

  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const currentScene = () => { };

  const changeGameScene = () => {
    if (phaserRef.current) {
      if (crTick.cur === 1) {
        const scene = phaserRef.current.scene as Prepare;

        if (scene && scene.sys.config === "Prepare") {
          if (crTick.prev === 1) {
            scene.changeScene();
          } else {
            scene.setSceneData(crTick.prev);
          }
        }
      } else {
        setTimeout(() => {
          const scene = phaserRef.current!.scene as Prepare;
          if (scene && scene.sys.config === "Prepare") {
            scene.setSceneData(crTick.cur);
          }
        }, 120);
      }
    }
  };

  const changeEndScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as Play;

      if (scene && scene.sys.config === "Play") {
        scene.changeScene();
      }
    }
  };

  const changeBeforeScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as End;

      if (scene && scene.sys.config === "End") {
        scene.changeScene();
        // scene.setEndPosition(duration);
      }
    }
  };

  const dropPlayer = (player: string) => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as Play;

      if (scene && scene.sys.config === "Play") {
        scene.dropPlayer(player);
      }
    }
  };

  useEffect(() => {
    if (crashGameStatus.gameStatus === ECrashStatus.PREPARE) {
      changeBeforeScene();
    } else if (crashGameStatus.gameStatus === ECrashStatus.PROGRESS) {
      changeGameScene();
    } else if (crashGameStatus.gameStatus === ECrashStatus.END) {
      changeEndScene();
    } else if (crashGameStatus.gameStatus === ECrashStatus.START) {
      setCrTick({ prev: 1, cur: 1 });
    }
  }, [crashGameStatus.gameStatus, crTick.cur]);

  useEffect(() => {
    if (divRef.current) {
      setSceneHeight((451.0 * divRef.current.offsetWidth) / 940.0);
      // window.location.reload()
    }
  }, []);

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
    if (reqTest.test(inputValue) && inputValue !== "") {
      const updateValue =
        parseFloat(inputValue) >= 1
          ? inputValue.replace(/^0+/, "")
          : inputValue;
      setBetAmount(updateValue);
    } else if (inputValue === "") {
      setBetAmount(0);
    }
  };

  const handleMultiplierClick = (multiplier) => {
    const newValue = betAmount * multiplier;
    setBetAmount(newValue);
  };

  const handleStartBet = async () => {
    if (betAmount > 0) {
      if (selectedToken.name === "acme" && betAmount > 3000) {
        toast.error("Bet amount for ACME cannot exceed 3000");
        return;
      }
      if (!avaliableBet) {
        const joinParams = {
          target: avaliableAutoCashout
            ? Number(autoCashoutPoint) * 100
            : 1000000,
          betAmount: Number(betAmount).valueOf(),
          token: selectedToken.name,
        };
        socket?.emit("join-crash-game", joinParams);
      }
      setAvaliableAutoCashout(false);
    } else {
      toast.error("Bet amount must be greater than 0");
      return;
    }
    if (avaliableBet) {
      setAvaliableBet(false);
      socket?.emit("bet-cashout");
    }
  };

  const handleAutoBet = async () => {
    if (autoBet) {
      if (betAmount > 0) {
        if (selectedToken.name === "acme" && betAmount > 4000) {
          toast.error("Bet amount for ACME cannot exceed 4000");
          setAutoBet(true);
          return;
        }
        const joinParams = {
          cashoutPoint: Number(autoCashoutPoint).valueOf() * 100,
          count: Number(round).valueOf(),
          betAmount: Number(betAmount).valueOf(),
          token: selectedToken.name,
        };
        socket?.emit("auto-crashgame-bet", joinParams);
        setAutoBet(false);
      } else {
        toast.error("Bet amount must be greater than 0");
        setAutoBet(true);
      }
    } else {
      setAutoBet(true);
      socket?.emit("cancel-auto-bet");
    }
  };

  useEffect(() => {
    setCrTick((prev) => ({
      prev: prev.cur,
      cur: crashGameStatus?.crashTick,
    }));
  }, [crashGameStatus?.crashTick]);

  useEffect(() => {
    if (socket) {
      socket.emit("auth", getAccessToken());
    }
  }, [getAccessToken(), socket]);

  useEffect(() => {
    const handleJoinSuccess = (data) => {
      toast.success(data);
      if (data === CCrashGame_Msg.autobet_canceled) {
        setAutoBet(true);
      }

      if (data === CCrashGame_Msg.autobet_running) {
        setAutoBet(false);
      }
    };

    socket?.on("auto-crashgame-join-success", handleJoinSuccess);

    return () => {
      socket?.off("auto-crashgame-join-success", handleJoinSuccess);
    };
  }, [socket, toast]);

  useEffect(() => {
    const crashSocket: Socket<
      ICrashServerToClientEvents,
      ICrashClientToServerEvents
    > = io(
      `${CSERVER_URL}/crash`,
      { parser: customParser }
    );

    crashSocket.on(ECrashSocketEvent.GAME_STARTING, (data) => {
      setBetData([]);
      setBetCashout([]);
      setTotalAmount({
        acme: 0,
      });
    });

    crashSocket.on(ECrashSocketEvent.UPDATE_WALLET, (_data) => {
      dispatch(userActions.getSiteBalance());
    });

    crashSocket.on(ECrashSocketEvent.GAME_START, () => { });

    crashSocket.on(ECrashSocketEvent.GAME_END, (data) => {
      setAvaliableBet(false);
      setCrTick({ cur: 1, prev: 1 });
      crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 10 as any);
    });

    const calculateTotals = (bets) => {
      const totals = { acme: 0 };
      bets.forEach((bet) => {
        if (totals[bet.token] !== undefined) {
          totals[bet.token] += bet.betAmount;
        }
      });
      return totals;
    };

    crashSocket.on(ECrashSocketEvent.GAME_STATUS, (data) => {
      const user = data.players.find(
        (player) => player?.playerID === userData._id
      );
      const cashOutPoint =
        data?.gameStatus?.players[userData?._id]?.autoCashOut;

      setBetData(data.players);
      Object.keys(data.gameStatus.players).forEach((playerID) => {
        const playerData = data.gameStatus.players[playerID];
        setBetCashout((prev) => [...prev, playerData]);
      });

      if (user && user.betAmount) {
        if (user?.autobet) {
          setAutoBet(false);
        }

        if (user?.autobet === undefined) {
          if (user?.winningAmount) {
            setAvaliableBet(false);
          } else {
            setAvaliableBet(true);
          }
        }

        const selectedTokenObj = token.find((t) => t.name === user?.token);
        if (selectedTokenObj) {
          setSelectedToken(selectedTokenObj);
        }
        setBetAmount(Number(user?.betAmount));
        setAutoCashoutPoint(cashOutPoint ? cashOutPoint / 100 : 1.05);
      }

      const totals = calculateTotals(data.players);
      setTotalAmount((prevAmounts) => ({
        acme: (prevAmounts?.acme || 0) + totals.acme,
      }));
    });

    crashSocket.on(
      ECrashSocketEvent.GAME_BETS,
      (bets: TFormattedPlayerBetType[]) => {
        setBetData((prev: IBetType[]) => [...bets, ...prev]);
        const totals = calculateTotals(bets);
        setTotalAmount((prevAmounts) => ({
          acme: (prevAmounts?.acme || 0) + totals.acme,
        }));
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_JOIN_ERROR, (data) => {
      toast.error(data);
      if (
        data === CCrashGame_Msg.autobet_reached_max ||
        data === CCrashGame_Msg.autobet_not_enough_balance
      ) {
        setAutoBet(true);
      }
    });

    crashSocket.on(ECrashSocketEvent.CRASH_AUTO_BET_COUNT_MAX, (data) => {
      toast.error(data);
      setAutoBet(true);
    });

    crashSocket.on(ECrashSocketEvent.CRASH_AUTO_BET_BALANCE_ERROR, (data) => {
      toast.error(data);
      setAutoBet(true);
    });

    crashSocket.on(ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS, () => {
      setAvaliableBet(true);
    });

    crashSocket.on(ECrashSocketEvent.BET_CASHOUT, (data) => {
      dropPlayer(data?.userdata?.username ?? "");
      setBetCashout((prev) => [...prev, data?.userdata]);
    });

    setSocket(crashSocket);
    return () => {
      crashSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      crashGameStatus?.gameStatus === ECrashStatus.PROGRESS &&
      settings.isSoundPlay
    ) {
      if (!sound?.playing()) {
        play();
      }
    } else if (
      crashGameStatus?.gameStatus === ECrashStatus.END &&
      settings.isSoundPlay
    ) {
      stop();
      if (!explosionSound?.playing()) {
        playExplosion();
      }
    } else {
      stop();
      stopExplosion();
    }
    return () => {
      stop();
      stopExplosion();
    };
  }, [crashGameStatus?.gameStatus, settings.isSoundPlay]);

  useEffect(() => {
    dispatch(crashActions.loginCrashGame());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(crashActions.subscribeCrashGame());
  }, []);

  useEffect(() => {
    EventBus.on("current-scene-ready", (_scene_instance: Phaser.Scene) => {
      setPhaserLoad(true);
      setTimeout(() => {
        EventBus.emit("component-mounted");
      }, 1000);
    });
  }, []);

  useEffect(() => {
    if (selectMode === CBetMode[1]) {
      setAvaliableAutoCashout(true);
    }
  }, [selectMode]);

  return (
    <ScrollArea className="flex h-[calc(100vh-74px)] items-center justify-center">
      <div className="flex flex-col items-stretch gap-8">
        <div className="flex h-full w-full flex-row justify-between gap-6">
          <div className="w-full">
            <div
              className="z-20 flex items-center justify-center bg-primary"
            // style={{ backgroundImage: `url(/assets/coinBack.webp)` }}
            >
              <div className="flex max-w-5xl items-center justify-center">
                <div
                  className={cn(
                    `relative w-full rounded-md`
                  )}
                  ref={divRef}
                  style={{ height: sceneHeight }}
                >
                  <GameScene
                    ref={phaserRef}
                    currentActiveScene={currentScene}
                    height={sceneHeight}
                  />
                  {phaserLoad && <GraphicDisplay />}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col border-t border-black md:flex-row">
              <div className="flex h-full w-full flex-col gap-2 p-6 md:w-5/12">
                <div className="flex flex-row items-center justify-between">
                  <span className="font-primary text-lg uppercase text-black">
                    bet mode
                  </span>
                  <div className="flex flex-row items-center gap-3">
                    {CBetMode.map((item, index) => (
                      <Button
                        className={cn(
                          "min-h-full border border-black bg-white px-5 py-3 font-secondary font-medium capitalize text-black shadow-btn-shadow",
                          selectMode === item &&
                          " bg-primary shadow-btn-shadow-active"
                        )}
                        key={index}
                        onClick={() => setSelectMode(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex h-full w-full flex-col gap-2">
                  <div
                    className={`flex flex-col gap-2`}
                  >
                    <p className="w-6/12 font-secondary text-sm capitalize text-black">
                      bet amount
                    </p>
                    <div className="relative">
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={handleBetAmountChange}
                        className="border border-black bg-light-gray text-black placeholder:text-gray-700"
                        disabled={isAutoMode && !autoBet}
                      />
                      <span className="text-gray500 absolute right-4 top-0 flex h-full items-center justify-center font-secondary text-xs uppercase font-bold">
                        ACME
                      </span>
                    </div>
                    <div className="grid grid-cols-3 space-x-3">
                      {multiplerArray.map((item, index) => (
                        <Button
                          disabled={isAutoMode && !autoBet}
                          className="border border-black bg-white py-2 font-secondary text-sm text-black shadow-btn-shadow"
                          key={index}
                          onClick={() => handleMultiplierClick(item)}
                        >
                          {item + "x"}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-col justify-between gap-3">
                      <div className="flex w-full flex-row">
                        <div className="flex w-4/12 flex-row items-center gap-2">
                          {
                            selectMode === CBetMode[0] && (
                              <Checkbox
                                id="terms"
                                className="text-[#049DD9]"
                                checked={avaliableAutoCashout}
                                disabled={
                                  isAutoMode
                                    ? false
                                    : ((avaliableAutoCashout &&
                                      crashGameStatus?.gameStatus ===
                                      ECrashStatus.PROGRESS) || avaliableBet)
                                }
                                onClick={() =>
                                  setAvaliableAutoCashout(!avaliableAutoCashout)
                                }
                              />
                            )
                          }
                          <span className="select-none items-center justify-center font-secondary text-base font-semibold text-black">
                            Auto Cashout
                          </span>
                        </div>
                        <div className="flex w-8/12 justify-between gap-3">
                          <Slider
                            className={`w-10/12 cursor-pointer 
                              ${(isAutoMode
                                ? false
                                : (!avaliableAutoCashout ||
                                  crashGameStatus?.gameStatus ===
                                  ECrashStatus.PROGRESS)) ? "opacity-50"
                                : "opacity-150"
                              }`}
                            step={0.1}
                            min={1}
                            max={10}
                            value={[autoCashoutPoint]}
                            onValueChange={(value) =>
                              setAutoCashoutPoint(value[0])
                            }
                            disabled={
                              isAutoMode
                                ? false
                                : (!avaliableAutoCashout ||
                                  crashGameStatus?.gameStatus ===
                                  ECrashStatus.PROGRESS)
                            }
                          />
                          <span className="flex h-full font-secondary text-black">
                            {autoCashoutPoint}x
                          </span>
                        </div>
                      </div>
                    </div>
                    {isAutoMode && (
                      <>
                        <span className="text-center font-secondary text-sm mt-2 uppercase text-black">
                          number of round
                        </span>
                        <div className="grid grid-cols-5 space-x-3">
                          {roundArray.map((item, index) => (
                            <Button
                              disabled={isAutoMode && !autoBet}
                              className={`border border-black bg-white py-2 font-secondary text-black shadow-btn-shadow ${round === item && "bg-primary "}`}
                              key={index}
                              onClick={() => setRound(item)}
                            >
                              {item === 10000 ? "∞" : item}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    className="w-full rounded-lg bg-dark-pink mt-5 px-3 py-3 font-primary text-base uppercase text-white shadow-card-shadow"
                    disabled={
                      isAutoMode
                        ? false
                        : (crashGameStatus?.gameStatus !==
                          ECrashStatus.PREPARE &&
                          !avaliableBet) ||
                        (crashGameStatus?.gameStatus !==
                          ECrashStatus.PROGRESS &&
                          avaliableBet) ||
                        (crashGameStatus?.gameStatus ==
                          ECrashStatus.PROGRESS &&
                          avaliableAutoCashout)
                    }
                    onClick={isAutoMode ? handleAutoBet : handleStartBet}
                  >
                    {isAutoMode
                      ? autoBet
                        ? "Auto Bet"
                        : "Cancel"
                      : avaliableBet
                        ? "Cash Out"
                        : "Start Bet"}
                  </Button>
                </div>
              </div>
              <BetBoard
                betData={betData}
                betCashout={betCashout}
                totalAmount={totalAmount}
                crashStatus={crashGameStatus?.gameStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
