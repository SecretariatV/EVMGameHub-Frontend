import { NavItem, NavItemGroup } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { usePathname } from "@/hooks";

type DashboardNavProps = {
  items: NavItemGroup[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavItemProps = {
  item: NavItem;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavGroupProps = {
  item: NavItemGroup;
};

const DashboardNavItem = ({ item, setOpen }: DashboardNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      key={item.href}
      target={item.href.includes("https://") ? "_blank" : undefined}
      className={`flex items-center gap-3 border border-black px-5 py-[6px] shadow-btn-shadow duration-300 active:shadow-none
      ${isActive ? "bg-primary shadow-btn-shadow-active" : "text-black"}`}
      to={item.href}
    >
      {item.icon}
      <span className="whitespace-nowrap font-secondary text-base uppercase tracking-wide text-black">
        {item.label}
      </span>
    </Link>
  );
};

const DashboardNavGroup = ({ item }: DashboardNavGroupProps) => {
  return (
    <Collapsible className="w-full data-[state='closed']:!h-6" open={true}>
      <div className="flex w-full select-none items-center justify-between">
        <span className="font-primary text-sm capitalize text-black">
          {item.title}
        </span>
      </div>
      <CollapsibleContent className="mt-6 flex flex-col gap-2 transition-transform duration-100 ease-out">
        {item.items.map((subitem, index) => (
          <DashboardNavItem key={index} item={subitem} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function DashboardNav({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex w-full flex-col gap-7">
      {items.map((item, index) => (
        <DashboardNavGroup key={index} item={item} />
      ))}
    </nav>
  );
}

export function DashboardNavMenu({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex w-full flex-col gap-7">
      {items.map((item, index) => (
        <DashboardNavGroup key={index} item={item} />
      ))}
    </nav>
  );
}
