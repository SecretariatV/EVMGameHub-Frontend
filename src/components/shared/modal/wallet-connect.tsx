import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
// import { ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import useToast from "@/hooks/use-toast";
import { useAppSelector } from "@/store/redux";
// import LoadingIcon from "../loading-icon";
import { Connector, useAccount, useChainId, useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { CEthWallets } from "@/utils/crypto";

declare global {
  interface Window {
    sonar?: any;
  }
}

// const defaultLoading = {
//   metamask: false,
//   cosmostation: false,
//   leap: false,
//   sonar: false,
// };

const WalletConnectModal = () => {
  const modal = useModal();
  const toast = useToast();
  const { open, type, afterModal } = useAppSelector(
    (state: any) => state.modal
  );
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const filteredConnectors = connectors.filter(
    (item) => item.type !== "injected"
  );

  const isOpen = open && type === ModalType.WALLETCONNECT;

  const handleClickWallet = (connector: Connector) => async () => {
    try {
      await connect({ connector, chainId });
    } catch (error) {
      toast.error("Reject request");
    }
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.WALLETCONNECT);
      if (afterModal) {
        modal.open(afterModal);
      }
    }
  };

  useEffect(() => {
    if (address) {
      hanndleOpenChange();
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="font-secondary! rounded-lg border-2 border-x-primary bg-primary p-10 text-black sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center font-primary text-2xl">
            CONNECT WALLET
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {filteredConnectors.map((connector, index) => (
            <ConnectorButton
              connector={connector}
              onClick={handleClickWallet(connector)}
              key={index}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => Promise<void>;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <Button
      disabled={Boolean(!ready)}
      onClick={onClick}
      className="active-card-shadow border-[1px] border-black bg-white p-4"
    >
      <div className="flex h-full flex-col items-center justify-around gap-3">
        <img
          src={CEthWallets[connector.type]?.src}
          alt={CEthWallets[connector.type]?.title}
          className="h-10"
        />
        <p>{CEthWallets[connector.type]?.title}</p>
      </div>
    </Button>
  );
}

export default WalletConnectModal;
