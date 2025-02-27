import { useEffect, useState } from "react";
import { MenuIcon, MessageSquareText } from "lucide-react";
import Sidebar from "../shared/sidebar";
import Header from "../shared/header";
import MobileSidebar from "../shared/mobile-sidebar";
import MobileLivechat from "../shared/mobile-livechat";
import LiveChat from "../shared/live-chat";
import { useOpen } from "@/provider/chat-provider";
import { useAppDispatch } from "@/store/redux";
import { getAccessToken } from "@/utils/axios";
import { paymentActions } from "@/store/redux/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [liveChatOpen, setLiveChatOpen] = useState<boolean>(false);
  const { open } = useOpen();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(paymentActions.loginPaymentServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(paymentActions.subscribePaymentServer());
  }, []);
  return (
    <div className="flex h-screen bg-white">
      <div className="absolute z-[100] flex h-full w-full items-center justify-center backdrop-blur-lg lg:hidden">
        <p className="text-center text-2xl font-bold text-white">
          This application is only available on PC
        </p>
      </div>
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex flex-shrink-0">
          <button
            className="h-full border-b border-r border-black bg-primary px-4 text-black bg-blend-multiply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Header />
        </div>
        <main className="flex h-full flex-row justify-between focus:outline-none">
          <div className="flex-1">{children}</div>
          <MobileLivechat
            livechatOpen={liveChatOpen}
            setLivechatOpen={setLiveChatOpen}
          />
          <div
            className={`hidden transform shadow-lg shadow-purple-0.15 transition-all duration-300 ease-in-out 2xl:flex ${open ? "w-[278px] translate-x-0 opacity-100" : "w-0 translate-x-full opacity-0"}`}
          >
            <LiveChat />
          </div>
          <MessageSquareText
            className="fixed bottom-8 right-8 z-50 block h-12 w-12 cursor-pointer bg-primary p-3 text-lg text-black bg-blend-multiply shadow-card-shadow 2xl:hidden"
            onClick={() => setLiveChatOpen(true)}
          />
        </main>
      </div>
    </div>
  );
}
