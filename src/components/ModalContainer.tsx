import { useModalStore } from "@/store/modal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ShareModal from "./ShareModal";
import ContactUsModal from "./ContactUsModal";
import SettingsModal from "./SettingsModal";

const ModalContainer = () => {
  const { activeModal, setActiveModal } = useModalStore();
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <ShareModal />
      <ContactUsModal />
      <SettingsModal />
    </>
  );
};

export default ModalContainer;
