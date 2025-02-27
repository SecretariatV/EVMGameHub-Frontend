import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import axiosInstance from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import { EHistoryType } from "@/constants/data";
import { THistoryType } from "@/types/dashboard";
import HistoryRow from "./history-row";

const CHistoryHeader = {
  betting: {
    first: 'Game',
    second: 'Transaction Type',
    third: 'Transaction Date',
    fourth: 'Amount'
  },
  withdrawl: {
    first: 'Amount',
    second: 'Wallet Address',
    third: 'Transaction Date',
    fourth: 'Transaction Hash'
  },
  deposit: {
    first: 'Amount',
    second: 'Wallet Address',
    third: 'Transaction Date',
    fourth: 'Transaction Hash'
  }
}

export default function BettingHistory({ historyType }: { historyType: EHistoryType }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCounts, setTotalCounts] = useState(0);
  const [pageList, setPageList] = useState<number[]>([]);

  const pageLimit = 10; // You can adjust this value as needed

  const [historyData, setHistoryData] = useState<THistoryType[]>([]);

  const changePageNum = async (pageNum: number) => {
    setCurrentPage(pageNum);
  }

  const fetchHistoryData = async () => {
    const res = await axiosInstance.post(`${BACKEND_API_ENDPOINT.dashboard.history}?type=${historyType}&page=${currentPage - 1}&limit=${pageLimit}`);
    setHistoryData(res?.data?.items ?? [])
    setTotalCounts(res?.data?.pageInfo?.totalPages ?? 0)
  }

  useEffect(() => {
    fetchHistoryData();
  }, [historyType, currentPage]);

  useEffect(() => {
    const maxPagesToShow = 3;
    let pages: number[] = [];

    if (totalCounts <= maxPagesToShow) {
      pages = Array.from({ length: totalCounts }, (_, index) => index + 1);
    } else {
      const pagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const pagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

      let startPage = Math.max(currentPage - pagesBeforeCurrent, 1);
      let endPage = Math.min(currentPage + pagesAfterCurrent, totalCounts);

      if (startPage <= 3) {
        endPage = startPage + maxPagesToShow - 1;
      } else if (endPage >= totalCounts - 2) {
        startPage = totalCounts - maxPagesToShow + 1;
      }

      pages = Array.from({ length: (endPage - startPage + 1) }, (_, index) => startPage + index);

      if (startPage > 1) {
        pages.unshift(100000);
        pages.unshift(1);
      }
      if (endPage < totalCounts) {
        pages.push(100001);
        pages.push(totalCounts);
      }
    }

    setPageList(pages);
  }, [totalCounts, currentPage, setPageList]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between p-3">
          <span className="w-3/12 font-secondary text-base font-medium">
            {CHistoryHeader[historyType].first}
          </span>
          <span className="w-3/12 font-secondary text-base font-medium">
            {CHistoryHeader[historyType].second}
          </span>
          <span className="w-3/12 text-center font-secondary text-base font-medium">
            {CHistoryHeader[historyType].third}
          </span>
          <span className="w-3/12 text-end font-secondary text-base font-medium">
            {CHistoryHeader[historyType].fourth}
          </span>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)] w-full p-3">
          <HistoryRow items={historyData} type={historyType} />
        </ScrollArea>
        <div className="flex flex-row items-center justify-between">
          <span className="text-base">Show {pageLimit} Transactions</span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => changePageNum(Math.max(1, currentPage - 1))}
                  className="cursor-pointer border border-black bg-white p-2 text-black shadow-card-shadow"
                />
              </PaginationItem>
              {pageList.map((pageValue) => (
                <PaginationItem key={pageValue}>
                  {
                    pageValue < 10000 ? (
                      <PaginationLink
                        onClick={() => changePageNum(pageValue)}
                        className={cn(
                          "cursor-pointer select-none border border-black bg-white p-2 text-black shadow-card-shadow",
                          {
                            "bg-primary": currentPage === pageValue,
                          }
                        )}
                      >
                        {pageValue}
                      </PaginationLink>
                    ) : <PaginationEllipsis />
                  }
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    changePageNum(
                      Math.min(
                        currentPage + 1,
                        totalCounts
                      )
                    )
                  }
                  className="cursor-pointer border border-black bg-white p-2 text-black shadow-card-shadow"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
