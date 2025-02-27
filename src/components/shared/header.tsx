import Heading from "./heading";
import UserNav from "./user-nav";
import { MessageSquareMore } from "lucide-react";
import { Button } from "../ui/button";
import useModal from "@/hooks/use-modal";
import { ModalType } from "@/types/modal";
import { useOpen } from "@/provider/chat-provider";
import { useAppSelector } from "@/store/redux";
import { useEffect } from "react";
import useSound from "use-sound";
import { Icon } from "../icon";
import AddCoins from "./add-coins";

export default function Header() {
  const modal = useModal();
  const { open, setOpen } = useOpen();
  const userData = useAppSelector((store: any) => store.user.userData);
  const settings = useAppSelector((store: any) => store.settings);
  const [play, { stop }] = useSound("/assets/audio/background_audio.mp3", {
    volume: 0.25,
    loop: true,
  });

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  useEffect(() => {
    if (settings.isMusicPlay) {
      play();
    } else {
      stop();
    }
  }, [settings.isMusicPlay]);

  return (
    <div className="flex w-full flex-row items-center justify-between border-b border-black bg-primary">
      <Heading userRole={userData?.role} />
      <div className="flex flex-row gap-5">
        <div className="mr-20 flex items-center gap-3">
          {userData?.username !== "" ? (
            <>
              <AddCoins />
              <div className="flex flex-row items-center gap-4">
                {/* <Button className="active-card-shadow border border-black p-1.5">
                  <Icon
                    name="Notification"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                  />
                </Button> */}
                <Button
                  className="active-card-shadow hidden border border-black bg-transparent p-1.5 hover:bg-transparent 2xl:flex"
                  onClick={() => setOpen(!open)}
                >
                  <MessageSquareMore className={`h-5 w-5`} />
                </Button>
                <UserNav />
              </div>
            </>
          ) : (
            <Button
              className="flex items-center gap-2 border border-black bg-light-green p-2 font-primary uppercase text-black shadow-card-shadow"
              onClick={handleSignIn}
            >
              <Icon name="Wallet" width={20} height={20} viewBox="0 0 20 20" />
              Log In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
