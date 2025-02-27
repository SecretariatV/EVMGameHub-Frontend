import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import useToast from "@/hooks/use-toast";
import AESWrapper from "@/lib/encryption/aes-wrapper";
import { CONETIME_LIMIT, finance, token } from "@/constants/data";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import LoadingIcon from "../loading-icon";
import { paymentActions, userActions } from "@/store/redux/actions";
import { SiweMessage } from "siwe";
import {
  useAccount,
  useChainId,
  useSignMessage,
  useWriteContract,
} from "wagmi";
import { CACME_TOKEN_ABI, CACME_TOKEN_CONTRACT_ADDRESS } from "@/utils/crypto";
import useAcmeBalance from "@/hooks/use-acmeBalance";
import { parseUnits } from "ethers/lib/utils";
import { truncateString } from "@/utils/truncate";

const DepositModal = () => {
  const modal = useModal();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const modalState = useAppSelector((state) => state.modal);
  const paymentState = useAppSelector((state) => state.payment);
  const isOpen = modalState.open && modalState.type === ModalType.DEPOSIT;
  const toast = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [selectedFinance, setSelectedFinance] = useState("Deposit");
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const aesWrapper = AESWrapper.getInstance();
  const { acmeBalance, updateBalance } = useAcmeBalance();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.DEPOSIT);
    }
  };

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    setDepositAmount(inputValue);
  };

  const handleWithdraw = async () => {
    dispatch(paymentActions.paymentFailed(""));
    dispatch(paymentActions.setTxProgress(true));

    if (
      !userState?.userData?.signAddress ||
      userState?.userData?.signAddress === ""
    ) {
      dispatch(paymentActions.paymentFailed("Withdraw address is invalid"));
      return;
    }
    if (
      Number(depositAmount) > Number(userState?.wallet?.acme ?? 0) ||
      Number(depositAmount) <= 0
    ) {
      dispatch(paymentActions.paymentFailed("Insufficient token"));
      return;
    }

    if (userState?.userData?.signAddress !== accountAddress) {
      dispatch(paymentActions.paymentFailed("Connect withdraw wallet"));
      return;
    }

    if (
      selectedToken.name === token[0].name &&
      Number(depositAmount) > CONETIME_LIMIT.acme
    ) {
      dispatch(
        paymentActions.paymentFailed(
          `Exceed withdraw limit: ${CONETIME_LIMIT.acme}`
        )
      );
      return;
    }

    dispatch(paymentActions.setTxProgress(true));
    dispatch(paymentActions.paymentFailed(""));

    const currentDate = new Date();
    currentDate.setMilliseconds(0);
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    const issuedAt = currentDate.toISOString();
    const message = new SiweMessage({
      domain: window.location.host,
      address: accountAddress,
      statement: `Withdraw ${Number(depositAmount).valueOf()} ${selectedToken.name.toUpperCase()} from Pixasino`,
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce: accountAddress,
      issuedAt,
    });
    const signedTx = await signMessageAsync({
      message: message.prepareMessage(),
    });
    if (!signedTx) {
      dispatch(paymentActions.paymentFailed("Reject withdraw"));
      return;
    }

    if (accountAddress) {
      try {
        const withdrawParam = {
          currency: selectedToken.name,
          amount: Number(depositAmount),
          address: accountAddress,
          signedTx,
        };
        const encryptedParam = await aesWrapper.encryptMessage(
          paymentState.admin.address1,
          JSON.stringify(withdrawParam)
        );
        dispatch(paymentActions.withDraw(encryptedParam));
      } catch (err) {
        dispatch(paymentActions.paymentFailed("Withdraw rejected"));
        console.error(err);
      }
    }
    updateBalance();
  };

  const handleDeposit = async () => {
    try {
      dispatch(paymentActions.paymentFailed(""));
      dispatch(paymentActions.setTxProgress(true));

      const adminWalletAddress = await aesWrapper.decryptMessage(
        paymentState.admin.address1,
        paymentState.admin.address2
      );

      if (Number(depositAmount) > acmeBalance || Number(depositAmount) <= 0) {
        dispatch(paymentActions.paymentFailed("Insufficient token"));
        return;
      }
      if (accountAddress) {
        try {
          const currentDate = new Date();
          currentDate.setMilliseconds(0);
          currentDate.setSeconds(0);
          currentDate.setMinutes(0);
          const issuedAt = currentDate.toISOString();
          const message = new SiweMessage({
            domain: window.location.host,
            address: accountAddress,
            statement: `Deposit ${Number(depositAmount).valueOf()} ${selectedToken.name.toUpperCase()} to Pixasino`,
            uri: window.location.origin,
            version: "1",
            chainId,
            nonce: accountAddress,
            issuedAt,
          });
          const signedTx = await signMessageAsync({
            message: message.prepareMessage(),
          });
          if (!signedTx) {
            dispatch(paymentActions.paymentFailed("Reject deposit"));
            return;
          }

          const hashTx = await writeContractAsync({
            abi: CACME_TOKEN_ABI,
            address: CACME_TOKEN_CONTRACT_ADDRESS,
            functionName: "transfer",
            args: [adminWalletAddress, parseUnits(depositAmount, 18)],
          });
          const depositParam = {
            currency: selectedToken.name,
            amount: Number(depositAmount).valueOf(),
            txHash: hashTx,
            address: accountAddress,
            signedTx,
          };
          const encryptedData = await aesWrapper.encryptMessage(
            paymentState.admin.address1,
            JSON.stringify(depositParam)
          );
          dispatch(paymentActions.deposit(encryptedData));
          setTimeout(() => {
            updateBalance();
          }, 5000);
        } catch (err) {
          dispatch(paymentActions.paymentFailed("Reject deposit"));
          console.warn("tx_error", err);
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(paymentActions.paymentFailed("Reject deposit"));
    }
  };

  useEffect(() => {
    updateBalance();
  }, [paymentState.txProgress]);

  useEffect(() => {
    if (isOpen) {
      updateBalance();
      dispatch(userActions.getSiteBalance());
      dispatch(paymentActions.subscribePaymentServer());
      dispatch(paymentActions.loginPaymentServer());
    }
    setDepositAmount("");
  }, [isOpen]);

  useEffect(() => {
    if (paymentState.error === "Withdraw Success") {
      toast.success("Withdraw Success");
      dispatch(paymentActions.paymentFailed(""));
    } else if (paymentState.error === "Deposit Success") {
      toast.success("Deposit Success");
      dispatch(paymentActions.paymentFailed(""));
    } else if (paymentState.error !== "") {
      toast.error(paymentState.error);
      dispatch(paymentActions.paymentFailed(""));
    }
    updateBalance();
  }, [paymentState.error]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-6 rounded-lg border-2 border-primary bg-primary p-10 text-black sm:max-w-sm">
        <DialogHeader className="mb-[-25px] flex flex-row">
          <div className="flex w-full flex-row items-center justify-center py-4">
            <img src="/assets/logo.png" className="h-20" />
          </div>
        </DialogHeader>
        <div className="flex flex-row items-center justify-center gap-5">
          {finance.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedFinance(item)}
              className={`${selectedFinance === item ? " border-black" : "border-transparent"} border-b-2 p-2 font-secondary text-black transition-all duration-300 ease-out`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex w-full flex-col justify-between gap-3">
          <div className="flex w-full flex-row items-center justify-between">
            <span className="w-4/12 pl-3 text-start text-xs text-black">
              Assets
            </span>
            <span className="w-4/12 text-center text-xs text-black">
              Site Balance
            </span>
            <span className="w-4/12 text-center text-xs text-black">
              Wallet Balance
            </span>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="flex w-4/12 flex-row items-center gap-3 pl-3 uppercase text-black">
              {/* <img
                    src={`/assets/tokens/${tokenName}.webp`}
                    className="h-5 w-5"
                  /> */}
              acme
            </span>
            <span className="w-4/12 text-center text-black">
              {(Math.floor(Number(userState?.wallet?.acme) * 100) / 100).toLocaleString() ?? 0}
            </span>
            <span className="w-4/12 text-center text-black">
              {truncateString(acmeBalance.toLocaleString())}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs">Token Amount</span>
          <div className="relative">
            <Input
              value={depositAmount}
              onChange={handleBetAmountChange}
              type="number"
              className="border-black placeholder:text-black"
            />
            <span className="text-gray500 absolute right-4 top-0 flex h-full items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2 uppercase">
                    <img src={selectedToken.src} className="h-4 w-4" />
                    <p className="text-xs font-bold">{selectedToken.name}</p>
                  </div>
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent className="w-12 border-purple-0.5 bg-[#0D0B32CC]">
                  <DropdownMenuRadioGroup
                    value={selectedToken.name}
                    onValueChange={(value) => {
                      const newToken = token.find((t) => t.name === value);
                      if (newToken) {
                        setSelectedToken(newToken);
                      }
                    }}
                  >
                    {token.map((t, index) => (
                      <DropdownMenuRadioItem
                        key={index}
                        value={t.name}
                        className="gap-5 uppercase text-white hover:bg-transparent"
                      >
                        <img src={t.src} className="h-4 w-4" />
                        {t.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent> */}
              </DropdownMenu>
            </span>
          </div>
          {selectedFinance === "Withdraw" && (
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-xs">Wallet Address</span>
              <Input
                readOnly
                contentEditable={false}
                value={userState?.userData?.signAddress}
                type="text"
                placeholder="e.g. 0x6Dd7EBC6cff6D4f4F09C9A06EA18f95C6321a2eE"
                className="border border-black placeholder:text-black"
              />
            </div>
          )}
        </div>
        <Button
          className="active-card-shadow w-full gap-2 border-[1px] border-black bg-light-green py-3 font-primary text-base capitalize hover:bg-light-green"
          type="submit"
          onClick={
            selectedFinance === "Withdraw" ? handleWithdraw : handleDeposit
          }
          disabled={paymentState.txProgress}
        >
          {selectedFinance}
          {paymentState.txProgress && <LoadingIcon />}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
