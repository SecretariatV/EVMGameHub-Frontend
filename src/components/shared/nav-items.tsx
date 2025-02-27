import { NavItemGroup } from "@/types";
import { Icon } from "../icon";
import {
  HiOutlineCalendar,
  HiOutlineCog,
  HiOutlineSupport,
} from "react-icons/hi";
import { Database, SquareKanban } from "lucide-react";

export const navItems: NavItemGroup[] = [
  {
    title: "Casino",
    items: [
      {
        title: "Crash",
        href: "/crash",
        icon: <Icon name="Crash" width={21} height={21} viewBox="0 0 21 21" />,
        label: "Crash",
      },
      {
        title: "Mines",
        href: "/mines",
        icon: <Icon name="Bomb" width={21} height={21} viewBox="0 0 21 21" />,
        label: "Mines",
      },
      {
        title: "Coin Flip",
        href: "/coin-flip",
        icon: <Icon name="Flip" width={21} height={21} viewBox="0 0 21 21" />,
        label: "Coinflip",
      },
    ],
  },
  {
    title: "Mini Games",
    items: [
      {
        title: "Rocket Rush",
        href: "/rocket-rush",
        icon: <Icon name="Rush" width={21} height={21} viewBox="0 0 21 21" />,
        label: "Rocket Rush",
      },
      {
        title: "Desert Run",
        href: "/desert-run",
        icon: <Icon name="Chrome" width={21} height={21} viewBox="0 0 21 21" />,
        label: "Desert Run",
      },
    ],
  },
];

export const navItemsMenu: NavItemGroup[] = [
  {
    title: "Menu",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: <HiOutlineCog size={20} className="text-black" />,
        label: "settings",
      },
      {
        title: "Help & Support",
        href: "/help-support",
        icon: <HiOutlineSupport size={20} />,
        label: "Help & Support",
      },
    ],
  },
];

export const navItemsDashboard: NavItemGroup[] = [
  {
    // title: "Dashboard",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: <SquareKanban size={20} />,
        label: "overview",
      },
      {
        title: "Profit & Loss",
        href: "/dashboard/profit-loss",
        icon: <Database size={20} />,
        label: "profit & loss",
      },
      {
        title: "History",
        href: "/dashboard/history",
        icon: <HiOutlineCalendar size={20} />,
        label: "history",
      },
    ],
  },
];
