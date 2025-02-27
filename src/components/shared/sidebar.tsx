import {
  navItems,
  navItemsDashboard,
  navItemsMenu,
} from "@/components/shared/nav-items";
import DashboardNav, { DashboardNavMenu } from "./dashboard-nav";
import { Link } from "react-router-dom";
import Logo from "/assets/logo.png";
import { ScrollArea } from "../ui/scroll-area";
import useModal from "@/hooks/use-modal";
import { ModalType } from "@/types/modal";
import { useAppSelector } from "@/store/redux";
import useToast from "@/hooks/use-toast";
import { Icon } from "../icon";
import { usePathname, useWindowSize } from "@/hooks";
import { useAccount } from "wagmi";

export default function Sidebar() {
  const modal = useModal();
  const toast = useToast();
  const { width } = useWindowSize();
  const pathname = usePathname();
  const { address: accountAddress } = useAccount();
  const isDashboard = pathname.includes("dashboard");
  const userData = useAppSelector((store: any) => store.user.userData);

  const handleDeposit = async () => {
    if (userData?.username === "") {
      toast.error("Please login to deposit");
      return;
    }
    if (!accountAddress) {
      modal.open(ModalType.WALLETCONNECT);
      return;
    }
    modal.open(ModalType.DEPOSIT);
  };

  return (
    <aside className="hidden h-screen w-72 flex-col items-center justify-between gap-6 overflow-x-hidden overflow-y-hidden border-r border-black xl:flex">
      <div className="flex w-full items-center justify-center border-b border-black bg-primary p-[2.8px]">
        <Link to="/" className="pt-1">
          <img src={Logo} alt="Logo" className="h-16" />
        </Link>
      </div>
      <ScrollArea className="h-screen w-full p-5">
        <div className="m-1 flex w-full flex-col items-center justify-between">
          <div className="flex w-full flex-col items-center gap-4">
            {isDashboard ? (
              <DashboardNavMenu items={navItemsDashboard} />
            ) : (
              <>
                <DashboardNav items={navItems} />
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black to-transparent" />
                <DashboardNavMenu items={navItemsMenu} />
              </>
            )}
          </div>
          <div className="mt-10 flex">
            <button
              className="active-btn-shadow flex items-center justify-center gap-2 rounded-lg border border-black bg-light-green px-4 py-2 text-white"
              onClick={handleDeposit}
            >
              <Icon
                name="Deposit"
                width={width! > 1024 ? 60 : 20}
                height={width! > 1024 ? 60 : 20}
                viewBox="0 0 60 60"
              />
              <div className="flex flex-col">
                <h1 className="font-primary text-black">Deposit Now</h1>
                {/* <span className="font-secondary text-sm font-light text-black">
                  Get $100 Donus
                </span> */}
              </div>
            </button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
