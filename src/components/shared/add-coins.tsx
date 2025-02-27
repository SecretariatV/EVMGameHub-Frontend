import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/redux";
import useModal from "@/hooks/use-modal";
import { ModalType } from "@/types/modal";

export default function AddCoins() {
  const userState = useAppSelector((state) => state.user);
  const modal = useModal();

  const handleOpenDepositModal = async () => {
    modal.open(ModalType.DEPOSIT);
  };
  return (
    <div className="flex items-center justify-end gap-2 border border-black bg-white p-1.5">
      <div className="flex justify-center min-w-[100px] flex-grow items-center gap-2">
        {/* <Icon name="Hold" width={16} height={16} viewBox="0 0 16 16" /> */}
        <span className="font-primary text-sm text-black">
          {(Math.floor(Number(userState?.wallet?.acme) * 100) / 100).toLocaleString() ?? 0}
        </span>
        <p className="text-xs font-bold">ACME</p>
      </div>
      <Button
        className="active-btn-shadow border border-black bg-light-green hover:bg-light-green"
        onClick={handleOpenDepositModal}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
