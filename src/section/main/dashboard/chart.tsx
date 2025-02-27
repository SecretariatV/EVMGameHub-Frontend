"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CSERVER_URL, EFilterDate, ERevenueType } from "@/constants/data";
import { axiosPost } from "@/utils/axios";
import { useEffect, useState } from "react";
import { getMonthName, getDayName } from "@/utils/utils";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";

export default function DashboardChart({
  date,
  revenueType,
}: {
  date: EFilterDate;
  revenueType: ERevenueType;
}) {
  const [adminAcmeBalance, setAdminAcmeBalance] = useState<number[]>([]);
  const [chartXData, setChartXData] = useState<string[]>([]);
  const [acme_currency, setAcmeCurrency] = useState<number>(0);

  const getDashboardData = async () => {
    try {
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDate();
      const currentMonth = new Date().getMonth() + 1;
      const response = await axiosPost(
        `${CSERVER_URL}/api/v1${BACKEND_API_ENDPOINT.dashboard.historyChart}?date=${date}&revenueType=${revenueType}`
      );

      const fetchedAcmeBalance = response?.acmeLogs.map((item) =>
        (item.lastBalance * response?.acme_currency).toFixed(2)
      );

      setAcmeCurrency(response?.acme_currency);


      if (fetchedAcmeBalance.length === 0) {
        return;
      }

      const tempXData: string[] = [];

      const maxLength = Math.max(
        fetchedAcmeBalance.length
      );

      while (fetchedAcmeBalance.length < maxLength) {
        fetchedAcmeBalance.unshift(fetchedAcmeBalance[0]);
      }

      if (date === EFilterDate.hour) {
        for (let i = 0; i < maxLength; i++) {
          const minutesAgo = i * 5;
          const date = new Date();
          date.setMinutes(date.getMinutes() - minutesAgo);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          tempXData.unshift(`${hours}:${minutes}`);
        }
      } else if (date === EFilterDate.day) {
        for (let i = 0; i < maxLength; i++) {
          const hour = (currentHour - i + 24) % 24;
          tempXData.unshift(`${hour.toString().padStart(2, "0")}h`);
        }
      } else if (date === EFilterDate.week) {
        for (let i = 0; i < maxLength; i++) {
          tempXData.unshift(getDayName(currentDay - i));
        }
      } else if (date === EFilterDate.month) {
        for (let i = 0; i < maxLength; i++) {
          tempXData.unshift(`${getMonthName(currentMonth)}/${currentDay - i}`);
        }
      } else {
        for (let i = 0; i < maxLength; i++) {
          tempXData.unshift(`${getMonthName(currentMonth - i)}`);
        }
      }

      setAdminAcmeBalance(fetchedAcmeBalance);
      setChartXData(tempXData);
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [date, revenueType]);

  const chartData = {
    options: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#556987",
          },
        },
      },
      xaxis: {
        categories: chartXData,
        labels: {
          style: {
            colors: "#556987",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
        colors: ["#0BA544", "#ff149d"],
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      stroke: {
        colors: ["#0BA544", "#ff149d"],
        width: 3,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Montserrat",
        labels: {
          colors: ["#0BA544", "#ff149d"],
        },
        markers: {
          fillColors: ["#0BA544", "#ff149d"],
        },
      },
      tooltip: {
        marker: {
          show: true,
          fillColors: ["#0BA544", "#ff149d"],
        },
        y: {
          formatter: function (value, { seriesIndex }) {
            if (seriesIndex === 0) {
              return (Number(value)).toFixed(2);
            } else if (seriesIndex === 1) {
              return Number(value).toFixed(2);
            }
            return value;
          },
        },
      },
    },
    series: [
      {
        name: "ACME",
        data: adminAcmeBalance,
      },
    ],
  };

  return (
    <Chart
      options={chartData.options as ApexOptions}
      series={chartData.series}
      type="line"
      width="100%"
      height="100%"
    />
  );
}
