import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import useToast from "@/hooks/use-toast";
import { axiosPost } from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { Input } from "@/components/ui/input";
import LoadingIcon from "../loading-icon";
import { useEffect, useState } from "react";
import { paymentActions, userActions } from "@/store/redux/actions";
import { useAccount } from "wagmi";
import { isAddress } from "ethers/lib/utils";


const FaucetModal = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const toast = useToast();
  const modal = useModal();
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state: any) => state.modal);
  const userState = useAppSelector((state: any) => state.user);
  const paymentState = useAppSelector((state) => state.payment);
  const { address } = useAccount();
  const isOpen =
    modalState.open && modalState.type === ModalType.FAUCET;
  const oneDayAfterFaucetReceived = userState.faucetDate ? new Date(
    (new Date(userState.faucetDate))?.setDate((new Date(userState.faucetDate))?.getDate() + 1)
  ) : new Date();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.FAUCET);
    }
  };

  const handleReceiveFaucet = async () => {
    try {
      const isValidAddress = isAddress(walletAddress);
      if (!isValidAddress) {
        toast.error("Invalid wallet address");
        return;
      }
      dispatch(paymentActions.paymentFailed(""));
      dispatch(paymentActions.setTxProgress(true));
      const receiveFaucetPayload = {
        walletAddress,
      };
      await axiosPost([
        BACKEND_API_ENDPOINT.payment.receiveFaucet,
        { data: receiveFaucetPayload },
      ]);
      toast.success("Faucet received successfully");
      dispatch(userActions.setFaucetDate());
      dispatch(paymentActions.setTxProgress(false));
    } catch (error) {
      dispatch(paymentActions.setTxProgress(false));
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-primary bg-primary p-10 text-black sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl uppercase">
            Faucet
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            <p>This faucet transfers Test Tokens</p>
            <p className="text-xs">
              You can receive the faucet only one per day
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-3">
          <div className="grid w-full flex-1 gap-2">
            <p className="text-sm">Network</p>
            <Input
              className="border border-gray-700 bg-white placeholder:text-gray-700"
              value="Sepolia"
              disabled
            />
          </div>
          <div className="grid w-full flex-1 gap-2">
            <p className="text-sm">Token</p>
            <Input
              className="border border-gray-700 bg-white placeholder:text-gray-700"
              value="ACME"
              disabled
            />
          </div>
          <div className="grid w-full flex-1 gap-2">
            <p className="text-sm">Wallet Address</p>
            <Input
              className="border border-gray-700 bg-white placeholder:text-gray-400"
              placeholder="0x736d51C8938581292778A6bA9Dc61f0E29D660f6"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <Button
            onClick={handleReceiveFaucet}
            className="active-card-shadow w-full border-[1px] border-black bg-light-green py-3 font-primary text-sm capitalize hover:bg-light-green"
            disabled={
              paymentState.txProgress ||
              (userState.faucetDate && oneDayAfterFaucetReceived > new Date())
            }
          >
            Receive 1000 ACME
            {paymentState.txProgress && <LoadingIcon />}
          </Button>
          {(userState.faucetDate &&
            oneDayAfterFaucetReceived > new Date()) && (
              <p className="text-xs text-red">
                You can receive the faucet after{" "}
                {oneDayAfterFaucetReceived.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            )}
          <div className="grid w-full flex-1 gap-1 border-t border-black pt-3">
            <p className="text-sm">How to get Sepolia ETH?</p>
            <p className="text-xs">
              You can get Sepolia ETH from the following faucets:
              <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank">Goole Cloud Web3</a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaucetModal;
