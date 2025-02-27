import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dispatch, SetStateAction } from "react";
import LiveChat from "./live-chat";
import { Link } from "react-router-dom";
import Logo from "/assets/logo.png";

type TMobileLivechatProps = {
  className?: string;
  setLivechatOpen: Dispatch<SetStateAction<boolean>>;
  livechatOpen: boolean;
};
export default function MobileLivechat({
  setLivechatOpen,
  livechatOpen,
}: TMobileLivechatProps) {
  return (
    <>
      <Sheet open={livechatOpen} onOpenChange={setLivechatOpen}>
        <SheetContent
          side="right"
          className="w-auto border-none bg-primary p-0 shadow-lg shadow-purple-0.15"
        >
          <div className="flex h-20 items-center justify-center border-x border-black bg-primary">
            <Link to="/" className="pt-1">
              <img src={Logo} alt="Logo" className="h-16" />
            </Link>
          </div>
          <LiveChat />
        </SheetContent>
      </Sheet>
    </>
  );
}
