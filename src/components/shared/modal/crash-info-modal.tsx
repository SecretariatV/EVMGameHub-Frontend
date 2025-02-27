import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import { useAppSelector } from "@/store/redux";
import { crashInfoSections } from "@/constants/data";

const InfoParagraph = ({ title, steps }) => (
  <div>
    <p className="text-white">{title}</p>
    {steps.map((step, index) => (
      <p key={index} className="text-sm text-gray-400">
        {step}
      </p>
    ))}
  </div>
);

const CrashInfoModal = () => {
  const modal = useModal();
  const modalState = useAppSelector((state: any) => state.modal);
  const isOpen = modalState.open && modalState.type === ModalType.CRASH_INFO;

  const hanndleOpenChange = async () => {
    modal.close(ModalType.CRASH_INFO);
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-white">
            How it works
          </DialogTitle>
        </DialogHeader>
        {crashInfoSections.map((section, index) => (
          <InfoParagraph
            key={index}
            title={section.title}
            steps={section.steps}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default CrashInfoModal;
