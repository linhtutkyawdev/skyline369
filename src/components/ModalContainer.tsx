import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ShareModal from "./ShareModal";
import ContactUsModal from "./ContactUsModal";
import SettingsModal from "./SettingsModal";
import DepositModal from "./DepositModal";
import ProfileModal from "./ProfileModal";
import WithdrawModal from "./WithdrawModal";

const ModalContainer = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <ProfileModal />
      <ShareModal />
      <ContactUsModal />
      <SettingsModal />
      <DepositModal />
      <WithdrawModal />
    </>
  );
};

export default ModalContainer;
