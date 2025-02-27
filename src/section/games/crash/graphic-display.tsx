import { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
// import * as gifler from 'gifler'

import EarnedPNG from "/assets/img/earned.png";
import RocketPNG from "/assets/img/rocket.png";
import FlameSpriteSheetPNG from "/assets/img/flame.png";
import ChartImage from "/assets/img/chart_bg.png";
import { ECrashStatus } from "@/constants/status";
import {
  cn,
  formatMillisecondsShort,
  initialLabel,
  numberFormat,
} from "@/utils/utils";
import GrowingNumber from "@/components/shared/growing-number";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const MAX_Y = 3;
const chartBGImage = new Image();
chartBGImage.src = ChartImage;

const getGradientColor = (context: { chart: ChartJS }) => {
  const ctx = context.chart.ctx;
  const { chart } = context;
  if (!chart?.height) {
    return;
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  gradient.addColorStop(0, `#87CEEBFF`);
  gradient.addColorStop(1, `#87CEEB10`);
  return gradient;
};

export default function GraphicDisplay() {
  const [labels, setLabels] = useState<Array<number>>(initialLabel);
  const [yValue, setYValue] = useState<Array<number>>([]);
  const [earned, setEarned] = useState<number>(-1);
  const [crTick, setCrTick] = useState({ prev: 1, cur: 1 });
  const [prepareTime, setPrepareTime] = useState(0);
  const [downIntervalId, setDownIntervalId] = useState(0);

  const crashGameStatus = useAppSelector((store) => store.crash);

  const graphColor = "#FF0000";

  const [data, setData] = useState({
    labels: initialLabel(),
    datasets: [
      {
        label: "",
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        borderColor: graphColor,
        borderWidth: 3,
        data: yValue,
        backgroundColor: getGradientColor,
        lineTension: 0.8,
        fill: true,
      },
    ],
  });

  const config = {
    options: {
      layout: {
        padding: {
          top: 70,
          bottom: 0,
          right: 80,
          left: 30,
        },
      },
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true, mode: "nearest" },
        rocket: {
          dash: [2, 2],
          color: "#fff",
          width: 3,
        },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
          ticks: {
            color: "black",
            autoSkip: true,
            display: false,
          },
        },
        y: {
          display: false,
          grid: { display: false },
          position: "left",
          ticks: {
            color: "black",
            callback: function (value: string) {
              return numberFormat(Number(value), 2) + "x";
            },
            markW: 5,
            markWScale: 6,
            markStepSize: 2,
            maxTicks: 4,
            minTicks: 4,
            minStepSize: 1,
            stepSize: 2,
          },
          min: 1,
          max:
            yValue[yValue.length - 1] >= MAX_Y
              ? yValue[yValue.length - 1]
              : MAX_Y,
        },
      },
    },
    plugins: [
      {
        id: "rocket",
        beforeDraw: (chart: ChartJS) => {
          // Draw the background image
          // if (chartBGImage.complete) {
          //   const ctx = chart.ctx;
          //   ctx.drawImage(chartBGImage, 0, 0, chart.width, chart.height);
          // } else {
          //   chartBGImage.onload = () => chart.draw();
          // }
        },
        afterDatasetsDraw: (chart: ChartJS) => {
          const { ctx, scales } = chart;

          // Get the last Y value from the chart data
          let lastYValue: number = chart.data.datasets[0].data[
            chart.data.datasets[0].data.length - 1
          ] as number;
          if (!lastYValue) lastYValue = 0;

          // becoming red color
          ctx.fillStyle = `rgba(0, 0, 0, 0.1)`; // Adjust the alpha (last parameter) for the desired transparency

          ctx.fillRect(0, 0, chart.width, chart.height);

          const lastXValue = chart.data.datasets[0].data.length - 1;

          const xP = scales.x.getPixelForValue(lastXValue);
          const yP = scales.y.getPixelForValue(lastYValue);
          const time =
            (0.99 * (20000 - 1000) * (lastYValue - 0.99)) / lastYValue;
          const dydt =
            (0.99 * (1000 - 20000)) / Math.pow(1000 - 25000 + time, 1);
          const angle = (Math.atan(dydt) / 3.14) * 180 - 33;
          // drawRocket(ctx, xP, yP, angle);
          // drawFlameAnimation(ctx, xP, yP, angle, scales);
        },
      },
    ],
  };

  // Function to draw the rocket image at a specific position
  const drawRocket = (
    ctx: CanvasRenderingContext2D | null,
    x: number,
    y: number,
    angle: number
  ) => {
    const rocketImage = new Image();
    rocketImage.src = RocketPNG;
    const rocketWidth = window.innerWidth > 500 ? 50 : 30;
    const rocket = {
      src: rocketImage,
      width: rocketWidth,
      height: rocketWidth * 0.6,
      rotationAngle: -angle,
    };
    if (!y) return;
    // Clear the canvas
    if (ctx) {
      ctx.save(); // Save the current canvas state
      ctx.translate(x, y); // Move the canvas origin to the rocket position
      ctx.rotate((rocket.rotationAngle * Math.PI) / 180); // Rotate the canvas
      // Draw the rocket at its new position (0, 0 in the rotated coordinate system)
      ctx.drawImage(
        rocket.src,
        -rocket.width / 2,
        -rocket.height / 2,
        rocket.width,
        rocket.height
      );
      ctx.restore();
    }
  };

  const drawFlameAnimation = (
    ctx: CanvasRenderingContext2D | null,
    x: number,
    y: number,
    angle: number,
    // eslint-disable-next-line
    scales: { [x: string]: any; y?: any }
  ) => {
    const flameImage = new Image();
    flameImage.src = FlameSpriteSheetPNG; // Replace with the path to your flame sprite sheet

    const flame = {
      spriteSheet: flameImage,
      frameWidth: 157, // Adjust according to your sprite sheet
      frameHeight: 203, // Adjust according to your sprite sheet
      totalFrames: 13, // Adjust according to your sprite sheet
      currentFrame: 0,
      rotationAngle: 90 - angle,
    };

    if (!ctx) {
      return;
    }

    const frameWidth = window.innerWidth > 500 ? 40 : 30;

    // Flame animation parameters
    let flameWidth = frameWidth; // Adjust according to your layout
    let flameHeight = frameWidth; // Adjust according to your layout

    if (y < scales.y.getPixelForValue(MAX_Y + 0.5)) {
      flameWidth *= 1.2;
      flameHeight *= 1.2;
    }
    // Calculate the current frame
    const currentFrame = Math.floor((Math.random() * 10) % flame.totalFrames);

    // ctx.drawImage(flame.spriteSheet, 0, 0, 157, 203, -20, 10, 30, 30)
    // Draw the flame animation`
    ctx.save(); // Save the current canvas state
    ctx.translate(
      window.innerWidth > 500 ? x : x + 12,
      window.innerWidth > 500 ? y : y - 8
    ); // Move the canvas origin to the rocket position
    ctx.rotate((flame.rotationAngle * Math.PI) / 180); // Rotate the canvas

    ctx.drawImage(
      flame.spriteSheet,
      0,
      currentFrame * flame.frameHeight + 15,
      flame.frameWidth,
      flame.frameHeight,
      -flameWidth / 2 - 2,
      -flameHeight / 2 + 40,
      flameWidth,
      flameHeight
    );
    ctx.restore();
  };

  const updatePrepareCountDown = () => {
    setPrepareTime((prev) => prev - 100);
  };

  useEffect(() => {
    const growthFunc = (ms: number) =>
      Math.floor(100 * Math.pow(Math.E, 0.00006 * ms));
    const calculateGamePayout = (ms: number): number => {
      const gamePayout = Math.floor(100 * growthFunc(ms)) / 100;
      return Math.max(gamePayout, 1);
    };

    if (yValue.length === 0) {
      const yArray: number[] = [];
      for (let i = crashGameStatus.crElapsed; i > 0; i -= 158) {
        const point = calculateGamePayout(i) / 100;
        yArray.push(point);
      }
      setYValue(yArray.reverse());
    } else {
      setYValue((values) => [...values, crTick.cur]);
    }
  }, [crTick.cur]);

  useEffect(() => {
    if (crashGameStatus.gameStatus === ECrashStatus.END) {
      setTimeout(() => {
        setData({
          labels: labels,
          datasets: [
            {
              label: "",
              pointBorderWidth: 0,
              pointHoverRadius: 0,
              borderColor: graphColor,
              borderWidth: 3,
              data: [],
              backgroundColor: getGradientColor,
              lineTension: 0,
              fill: true,
            },
            // {
            //   label: '',
            //   pointBorderWidth: 0,
            //   pointHoverRadius: 0,
            //   borderColor: graphColor,
            //   borderWidth: 0,
            //   data: [1, MAX_Y]
            // }
          ],
        });
        setEarned(-1);
        setLabels(initialLabel);
        setYValue([]);
      }, 1000);
    } else {
      const updateState = {
        labels: labels,
        datasets: [
          {
            label: "",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            borderColor: graphColor,
            borderWidth: 2,
            data: yValue,
            backgroundColor: getGradientColor,
            lineTension: 0,
            pointStyle: false,
            fill: true,
          },
        ],
      };

      if (labels.length < yValue.length) {
        setLabels((t) => [...t, yValue.length]);
      }

      setData(updateState);

      if (yValue.length === 0) {
        setLabels(initialLabel);

        setEarned(-1);
      }
    }
  }, [crashGameStatus.gameStatus, yValue.length, labels.length]);

  useEffect(() => {
    let intervalId: number | undefined;
    if (crashGameStatus?.gameStatus === ECrashStatus.PREPARE) {
      setPrepareTime(crashGameStatus?.prepareTime);
      intervalId = window.setInterval(updatePrepareCountDown, 100);
      setDownIntervalId(intervalId);
    } else {
      clearInterval(downIntervalId);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [crashGameStatus?.gameStatus, crashGameStatus?.prepareTime]);

  useEffect(() => {
    setCrTick((prev) => ({
      prev: prev.cur,
      cur: crashGameStatus?.crashTick,
    }));
  }, [crashGameStatus?.crashTick]);

  return (
    <div className="absolute left-0 top-0 h-full w-full rounded-lg">
      <div className="relative h-full w-full">
        <div className={`relative h-full w-full`}>
          {crashGameStatus.gameStatus === ECrashStatus.NONE && (
            <div className="crash-status-shadow absolute top-52 flex w-full flex-col items-center justify-center gap-5">
              <p className="text-[12px] font-extrabold uppercase text-[#fff] delay-100 xl:text-6xl">
                Starting...
              </p>
            </div>
          )}
          {(crashGameStatus.gameStatus === ECrashStatus.PROGRESS ||
            crashGameStatus.gameStatus === ECrashStatus.END) && (
            <div className="absolute left-12 top-24 flex min-w-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-black bg-primary p-6 shadow-card-shadow">
              <div
                className={cn(
                  "text-3xl font-bold text-black",
                  crashGameStatus.gameStatus === ECrashStatus.END &&
                    "crashed-value"
                )}
              >
                {crashGameStatus.gameStatus === ECrashStatus.END ? (
                  <p>{crashGameStatus.crBust.toFixed(2)}x</p>
                ) : (
                  <p>
                    <GrowingNumber start={crTick.prev} end={crTick.cur} />x
                  </p>
                )}
              </div>
              <p className={`text-sm font-semibold text-black`}>
                {crashGameStatus.gameStatus === ECrashStatus.PROGRESS
                  ? "Current Rate"
                  : "Crashed"}
              </p>
            </div>
          )}
          {crashGameStatus.gameStatus === ECrashStatus.PREPARE &&
            prepareTime > 0 && (
              <div className="crash-status-shadow absolute left-[35%] top-52 flex w-[100px] flex-col items-center justify-center gap-5 lg:left-0 lg:w-full">
                <p
                  className="text-stroke text-center font-primary text-[12px] font-extrabold uppercase text-black delay-100 md:text-6xl"
                  style={{
                    textShadow:
                      "2px 0 0 white, 0 1px 0 white, -1px 0 0 white, 0 -1px 0 white",
                  }}
                >
                  {formatMillisecondsShort(prepareTime)}
                </p>
              </div>
            )}
          <div
            className={`absolute flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out  ${
              earned > 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="absolute flex h-full w-full items-center justify-center">
              <img src={EarnedPNG} width={300} />
            </div>
            <div className="absolute flex h-full w-full items-center justify-center">
              <label className="text-[4rem] font-bold text-[#f8e855]">
                Earned {earned}
              </label>
            </div>
          </div>
          <div className="absolute left-0 top-0 flex w-full flex-row items-center justify-between px-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <span className="ms-2 inline-flex h-3 w-3 items-center justify-center rounded-full border border-black bg-[#0BA544] text-xs font-semibold text-blue-800" />
              <p className="text-sm capitalize text-white">Network status</p>
            </div>
            {crashGameStatus.crashHistory.length > 0 && (
              <div
                className={`flex items-center justify-start overflow-hidden px-[12px] py-[8px] opacity-100 transition-all duration-300 ease-in-out lg:px-[24px] lg:py-[16px]`}
              >
                {crashGameStatus.crashHistory.map((item, _index) => {
                  return (
                    <span
                      key={_index}
                      className={`mr-2 border border-black px-1.5 py-1 text-xs shadow-btn-shadow ${item.crashPoint > 1000 ? "bg-dark-pink text-white" : item.crashPoint > 300 ? "bg-primary" : "bg-light-green"}`}
                    >
                      {(item.crashPoint / 100).toFixed(2)}x
                    </span>
                  );
                })}
              </div>
            )}
            <Button className="border border-black p-2 shadow-card-shadow">
              <Icon name="Audio" width={20} height={20} />
            </Button>
          </div>
          {/* <Line
            className="w-full"
            data={data}
            {...(config as object)}
          /> */}
        </div>
      </div>
    </div>
  );
}
