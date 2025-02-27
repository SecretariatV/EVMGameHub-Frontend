import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  defaultMine,
  minesAmountPresets,
  minesMultiplerArray,
  token,
} from "@/constants/data";
import { EMinesStatus } from "@/constants/status";
import useToast from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { minesActions } from "@/store/redux/actions";
import { getAccessToken } from "@/utils/axios";
import { calculateMiningProbabilities } from "@/utils/utils";
import { useEffect, useState } from "react";

export default function MinesGameSection() {
  const toast = useToast();
  const [betAmount, setBetAmount] = useState(0);
  const [minesAmount, setMinesAmount] = useState(2);
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [probabilities, setProbabilities] = useState<number[]>([]);
  const [selectedProbability, setSelectedProbability] = useState<number>(0);
  const [minesStatus, setMinesStatus] = useState(defaultMine.map(() => false));
  const [isGameOver, setIsGameOver] = useState(false);
  const [mineStatus, setMineStatus] = useState(EMinesStatus.NONE);
  const dispatch = useAppDispatch();
  const minesState = useAppSelector((state: any) => state.mines);
  const [mineImages, setMineImages] = useState(
    Array(defaultMine.length).fill("mystery")
  );
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const resetGame = () => {
    setBetAmount(0);
    setMinesAmount(2);
    setSelectedToken(token[0]);
    setSelectedProbability(0);
    setMinesStatus(defaultMine.map(() => false));
    setIsGameOver(false);
    setMineStatus(EMinesStatus.NONE);
    setMineImages(Array(defaultMine.length).fill("mystery"));
    setLastClickedIndex(null);
    setClickedIndices(new Set());
  };

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
    if (multiplier.value === "max") {
      // Handle max amount logic
    } else {
      let newValue = betAmount;
      if (multiplier.unit === "+") {
        newValue += multiplier.value;
      } else if (multiplier.unit === "x") {
        newValue *= multiplier.value;
      }
      setBetAmount(newValue);
    }
  };

  const handleMinesAmountChange = (event) => {
    const inputValue = event.target.value;
    const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
    if (reqTest.test(inputValue) && inputValue !== "") {
      const updateValue =
        parseFloat(inputValue) >= 1
          ? inputValue.replace(/^0+/, "")
          : inputValue;
      setMinesAmount(updateValue);
    } else if (inputValue === "") {
      setMinesAmount(0);
    }
  };

  const handleMinePresetsAmount = (item) => {
    setMinesAmount(item);
  };

  const handleMinesClick = async (index) => {
    if (mineStatus === EMinesStatus.NONE) {
      toast.error('Click "Start Bet"');
      return;
    }
    if (isGameOver || isProcessing) return;
    setIsProcessing(true);
    setLastClickedIndex(index);
    setMineStatus(EMinesStatus.CLICKED);
    setClickedIndices((prev) => new Set(prev.add(index)));
    await dispatch(minesActions.rollingMinesgame(index));
    const propability = setTimeout(() => {
      setSelectedProbability((prev) => prev + 1);
    }, 1000);
    return () => {
      clearTimeout(propability);
    };
  };

  const handleMinesGame = () => {
    if (mineStatus === EMinesStatus.NONE) {
      if (
        betAmount > 0 &&
        betAmount <= 10000 &&
        minesAmount > 0 &&
        minesAmount < 25
      ) {
        setMineStatus(EMinesStatus.START);
        dispatch(
          minesActions.startMinesgame({
            betAmount: Number(betAmount),
            token: selectedToken.name,
            betMinesCount: minesAmount,
          })
        );
      } else {
        toast.error("Invalid Token Amount");
      }
    } else {
      dispatch(minesActions.cashoutgame());
      const gameover = setTimeout(() => {
        setIsGameOver(true);
        setTimeout(() => {
          setMineStatus(EMinesStatus.NONE);
          resetGame();
        }, 2000);
      }, 500);
      return () => clearTimeout(gameover);
    }
  };

  useEffect(() => {
    const result = calculateMiningProbabilities(minesAmount, 25) as number[];
    setProbabilities(result);
  }, [minesAmount]);

  useEffect(() => {
    dispatch(minesActions.loginMinesServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(minesActions.subscribeMinesServer());
    setMineStatus(EMinesStatus.NONE);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minesState.gameResult !== null && lastClickedIndex !== null) {
        const newMineImages = [...mineImages];
        if (minesState.gameResult) {
          newMineImages[lastClickedIndex] = "star";
        } else {
          newMineImages[lastClickedIndex] = "bomb";
          setLastClickedIndex(null);
          setIsGameOver(true);
        }
        setClickedIndices((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lastClickedIndex);
          return newSet;
        });
        setIsProcessing(false);
        dispatch(minesActions.minesgameRolled(null));
        setMineImages(newMineImages);
        if (!minesState.gameResult) {
          const gameOverTimer = setTimeout(() => {
            resetGame();
          }, 2000);
          return () => clearTimeout(gameOverTimer);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [minesState.gameResult, lastClickedIndex, mineImages]);

  useEffect(() => {
    if (minesState.error !== "") {
      toast.error(minesState.error);
      resetGame();
    }
  }, [minesState.error]);

  return (
    <ScrollArea className="z-50 flex h-[calc(100vh-64px)]">
      <div
        className="absolute bottom-0 left-0 z-[10] h-20 w-full"
        style={{
          backgroundImage: `url(/assets/games/coin-flip/coinflip-footer.png)`,
        }}
      ></div>
      <div className="z-[100] flex w-full flex-col">
        <div className="flex items-center justify-center"></div>
        <div className="flex h-12 items-center justify-center">
          {isGameOver && (
            <span className="flex items-center text-xl font-bold uppercase text-[#df8002]">
              {minesState.earned === null
                ? "Game over"
                : `WON ${minesState.earned}`}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div className="relative flex flex-row justify-around">
            <div className="w-full">
              {Array.from({ length: 5 }, (_, rowIndex) => (
                <div className="flex justify-center gap-16" key={rowIndex}>
                  {defaultMine
                    .slice(rowIndex * 5, (rowIndex + 1) * 5)
                    .map((mine, index) => (
                      <button
                        className={`group flex items-center justify-center ${minesStatus[rowIndex * 5 + index] ? "pointer-events-none" : ""} ${mineStatus === EMinesStatus.START ? "some-start-class" : ""} ${clickedIndices.has(rowIndex * 5 + index) ? "ripple-animation cursor-wait" : ""}`}
                        key={index}
                        onClick={() => {
                          if (
                            !minesStatus[rowIndex * 5 + index] &&
                            !isProcessing
                          ) {
                            handleMinesClick(rowIndex * 5 + index);
                          }
                        }}
                        aria-label={`Mine at position ${index + 1}`}
                      >
                        <img
                          src={`/assets/games/mines/${mineImages[rowIndex * 5 + index]}.svg`}
                          alt={`Mine ${mineImages[rowIndex * 5 + index]}`}
                          className="group h-16 w-16 hover:transition-all"
                        />
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-10">
            <div className="absolute 3xl:left-32 left-20 top-[150px] flex flex-col items-center rounded-lg border border-black bg-white px-6 py-2 shadow-btn-shadow">
              <img src="/assets/games/mines/star.svg" className="h-10 w-10" />
              <span className="font-primary text-xl font-semibold">25</span>
            </div>
            <div className="absolute 3xl:right-32 right-20 top-[150px] flex flex-col items-center rounded-lg border border-black bg-white px-6 py-2 shadow-btn-shadow">
              <img src="/assets/games/mines/bomb.svg" className="h-10 w-10" />
              <span className="font-primary text-xl font-semibold">00</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-primary text-lg capitalize text-black">
                    bet amount
                  </p>
                  <div className="relative w-full">
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={handleBetAmountChange}
                      disabled={mineStatus !== EMinesStatus.NONE}
                      className="rounded-sm border border-black bg-white text-center text-black placeholder:text-black"
                    />
                    <span className="text-gray500 absolute right-4 top-0 flex h-full items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex text-xs cursor-pointer items-center gap-2 uppercase">
                            <img src={selectedToken.src} className="h-4 w-4" />
                            {selectedToken.name}
                          </div>
                        </DropdownMenuTrigger>
                      </DropdownMenu>
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {minesMultiplerArray.map((item, index) => (
                    <Button
                      disabled={mineStatus !== EMinesStatus.NONE}
                      className="rounded-sm border border-black bg-white px-1 py-1.5 font-secondary text-xs font-semibold text-black shadow-btn-shadow"
                      key={index}
                      onClick={() => handleMultiplierClick(item)}
                    >
                      {item.value === "max"
                        ? "MAX"
                        : item.unit === "+"
                          ? item.unit + item.value
                          : item.value + item.unit}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex">
                <div className="flex w-full flex-col gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex w-full flex-col items-center gap-2">
                      <p className="font-primary text-lg capitalize text-black">
                        mines amount
                      </p>
                      <div className="relative w-full">
                        <Input
                          type="number"
                          value={minesAmount}
                          min={2}
                          max={24}
                          disabled={mineStatus !== EMinesStatus.NONE}
                          onChange={handleMinesAmountChange}
                          className="rounded-sm border border-black bg-white text-center text-black placeholder:text-black"
                        />
                        <div className="text-gray500 absolute right-4 top-0 flex h-full items-center justify-center">
                          <img
                            src="/assets/games/mines/bomb.svg"
                            className="h-5 w-5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-5">
                    {minesAmountPresets.map((item, index) => (
                      <Button
                        disabled={mineStatus !== EMinesStatus.NONE}
                        className={`rounded-sm border border-black bg-white py-1.5 font-secondary text-xs font-semibold uppercase text-black shadow-btn-shadow ${item === minesAmount ? "bg-primary shadow-btn-shadow-active" : ""}`}
                        key={index}
                        onClick={() => handleMinePresetsAmount(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="w-full rounded-lg border border-black bg-dark-pink py-3 font-primary text-base uppercase text-white shadow-card-shadow"
                onClick={handleMinesGame}
                disabled={
                  mineStatus !== EMinesStatus.NONE && lastClickedIndex === null
                }
              >
                {mineStatus === EMinesStatus.NONE ? "Start Bet" : "Cash Out"}
                <span className="text-sm">
                  {selectedProbability === 0
                    ? ""
                    : `$${(probabilities[selectedProbability - 1] * betAmount * 0.95)?.toFixed(2)}`}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
