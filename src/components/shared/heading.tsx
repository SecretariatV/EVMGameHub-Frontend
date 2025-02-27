import { adminWallets } from "@/constants/data";
import { cn } from "@/utils/utils";
import { usePathname } from "@/hooks";
import useModal from "@/hooks/use-modal";
import { Link } from "react-router-dom";
import { Icon } from "../icon";
import {
  HiChartBar,
  HiHome,
  HiOutlineChartBar,
  HiOutlineHome,
} from "react-icons/hi";
import { MdOutlineWaterDrop } from "react-icons/md";
import { useAccount } from "wagmi";
import { ModalType } from "@/types/modal";

type THeadingProps = {
  className?: string;
  userRole: string;
};

type TTabItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

export const tabItems: TTabItem[] = [
  {
    name: "Home",
    path: "/",
    icon: <HiOutlineHome size={20} />,
    activeIcon: <HiHome size={20} />,
  },
  {
    name: "Leaderboard",
    path: "/leader-board",
    icon: <Icon name="Trophy" width={20} height={20} viewBox="0 0 20 20 " />,
    activeIcon: (
      <Icon name="TrophyActive" width={20} height={20} viewBox="0 0 20 20" />
    ),
  },
];

export default function Heading({ className, userRole }: THeadingProps) {
  const pathname = usePathname();
  const { address: accountAddress } = useAccount();
  const modal = useModal()
  let items = tabItems;

  if (userRole.includes("MEMBER") || adminWallets.includes(accountAddress || "")) {
    items = [
      {
        name: "Home",
        path: "/",
        icon: <HiOutlineHome size={20} />,
        activeIcon: <HiHome size={20} />,
      },
      {
        name: "Leaderboard",
        path: "/leader-board",
        icon: <Icon name="Trophy" width={20} height={20} viewBox="0 0 20 20 " />,
        activeIcon: (
          <Icon name="TrophyActive" width={20} height={20} viewBox="0 0 20 20" />
        ),
      },
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <HiOutlineChartBar size={20} />,
        activeIcon: <HiChartBar size={20} />,
      }
    ];
  }
  const isActive = (itemPath: string) => {
    return itemPath === "/"
      ? pathname === "/"
      : pathname === itemPath || pathname.startsWith(itemPath + "/");
  };

  const handleFaucetClick = () => {
    modal.open(ModalType.FAUCET);
  };

  return (
    <div className="flex w-full flex-row items-center bg-primary">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            "flex min-h-full items-center gap-2 border border-transparent bg-transparent px-6 py-6 font-secondary text-base text-black transition-all duration-200 ease-in hover:bg-none",
            isActive(item.path) &&
            "border border-b border-black border-b-white bg-white text-base shadow-heading-shadow",
            isActive("/") && item.name === "Home" && "border-l border-l-white"
          )}
        >
          {isActive(item.path) ? item.activeIcon : item.icon}
          <span className="font-secondary text-base font-semibold uppercase">
            {item.name}
          </span>
        </Link>
      ))}
      {
        userRole.includes("MEMBER") && (
          <div
            onClick={handleFaucetClick}
            className="flex min-h-full cursor-pointer items-center gap-2 border border-transparent bg-transparent px-6 py-6 font-secondary text-base text-black transition-all duration-200 ease-in hover:bg-none"
          >
            <MdOutlineWaterDrop size={20} />
            <span className="font-secondary text-base font-semibold uppercase">
              Faucet
            </span>
          </div>
        )
      }
    </div>
  );
}
