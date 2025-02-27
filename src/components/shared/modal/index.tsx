import AddGoldModal from "./add-gold";
import CrashInfoModal from "./crash-info-modal";
import DepositModal from "./deposit";
import SignInModal from "./signin";
import SignUpModal from "./signup";
import WalletDepositModal from "./wallet-connect";
import ResetPasswordModal from "./reset-password";
import FaucetModal from "./faucet";

const Modal = () => {
  return (
    <>
      <SignInModal />
      <SignUpModal />
      <DepositModal />
      <AddGoldModal />
      <CrashInfoModal />
      <FaucetModal />
      <WalletDepositModal />
      <ResetPasswordModal />
    </>
  );
};

export default Modal;
