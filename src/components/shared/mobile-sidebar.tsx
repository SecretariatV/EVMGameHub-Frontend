import DashboardNav, {
  DashboardNavMenu,
} from "@/components/shared/dashboard-nav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { navItems, navItemsMenu } from "@/components/shared/nav-items";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import Logo from "/assets/logo.png";
import { ModalType } from "@/types/modal";
import { useAppSelector } from "@/store/redux";
import useModal from "@/hooks/use-modal";
import useToast from "@/hooks/use-toast";
import { Icon } from "../icon";
import { useWindowSize } from "@/hooks";
import { ScrollArea } from "../ui/scroll-area";
import { useAccount } from "wagmi";

type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};
export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen,
}: TMobileSidebarProps) {
  const modal = useModal();
  const toast = useToast();
  const { address: accountAddress } = useAccount();
  const { width } = useWindowSize();
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
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="flex w-72 flex-col items-center border-none bg-white px-0 py-0"
        >
          <div className="flex w-full items-center justify-center border-b border-black bg-primary p-[2.8px]">
            <Link to="/" className="pt-1">
              <img src={Logo} alt="Logo" className="h-16" />
            </Link>
          </div>
          <ScrollArea className="h-screen w-full p-5">
            <div className="m-1 flex w-full flex-col items-center justify-between">
              <div className="flex w-full flex-col items-center gap-4">
                <DashboardNav items={navItems} />
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black to-transparent" />
                <DashboardNavMenu items={navItemsMenu} />
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
        </SheetContent>
      </Sheet>
    </>
  );
}
