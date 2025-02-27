import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAccessToken, removeAllTokens } from "@/utils/axios";
import useToast from "@/hooks/use-toast";
import useModal from "@/hooks/use-modal";
import { ModalType } from "@/types/modal";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/redux/actions";
import { useAppSelector } from "@/store/redux";
import { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { getUserRandomAvatar } from "@/utils/utils";

export default function UserNav() {
  const modal = useModal();
  const dispatch = useDispatch();
  const toast = useToast();
  const userData = useAppSelector((store: any) => store.user.userData);
  const { address: walletAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const token = getAccessToken();

  const handleLogout = async () => {
    if (token) {
      await dispatch(userActions.initUserData());
      disconnect();
      removeAllTokens();
      toast.success("Logout Successfully");
    }
  };

  const handleResetPassword = async () => {
    modal.open(ModalType.RESETPASSWORD);
  };

  const toggleWalletConnection = async () => {
    if (walletAddress) {
      disconnect();
      toast.success("Wallet Disconnected");
    } else {
      modal.open(ModalType.WALLETCONNECT);
    }
  };

  useEffect(() => {
    if (token && !userData?.signAddress) {
      dispatch(userActions.initUserData());
      disconnect();
      removeAllTokens();
      toast.success("Logout Successfully");
    }
  }, [userData]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex w-full items-center justify-start gap-2">
          <img
            src={getUserRandomAvatar(userData?.username)}
            className="h-8 w-8 border border-black shadow-card-shadow"
          />
          <span className="font-primary text-lg font-medium text-black">
            {userData?.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="card-shadow text-gray50 w-56 rounded-none border-[1px] border-black bg-light-green bg-opacity-90"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-secondary text-lg leading-none text-black">
              {userData?.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer font-secondary text-black hover:bg-primary hover:text-black focus:bg-primary focus:text-black active:bg-primary active:text-black"
            onClick={handleResetPassword}
          >
            Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer font-secondary text-black hover:bg-primary hover:text-black focus:bg-primary focus:text-black active:bg-primary active:text-black"
            onClick={toggleWalletConnection}
          >
            {walletAddress ? "Disconnect Wallet" : "Connect Wallet"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem
          className="cursor-pointer font-secondary text-black hover:bg-primary hover:text-black focus:bg-primary focus:text-black active:bg-primary active:text-black"
          onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
