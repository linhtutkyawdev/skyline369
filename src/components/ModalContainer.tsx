import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ShareModal from "./ShareModal";
import ContactUsModal from "./ContactUsModal";
import SettingsModal from "./SettingsModal";
import DepositModal from "./DepositModal";
import ProfileModal from "./ProfileModal";
import WithdrawModal from "./WithdrawModal";
import NavMenuModal from "./NavMenuModal"; // Import the new modal

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
      <NavMenuModal /> {/* Render the new modal */}
    </>
  );
};

export default ModalContainer;
