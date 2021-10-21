import { useEffect, useState } from "react";

const ModalHandler = () => {
  const [isModalOpen, setIsModalOpen] = useState({
    addFriend: false,
    channelInvite: false,
    channelCreate: false,
    channelSetting: false,
    enterPassword: false,
    otp: false,
    gameSetting: false,
    gameResult: false,
    gameInvite: false,
  });

  const handleModalOpen = (key: string) => {
    console.log("open ", key);
    setIsModalOpen({
      ...isModalOpen,
      [key]: true,
    });
  };

  const handleModalClose = (key: string) => {
    console.log("close ", key);
    setIsModalOpen({
      ...isModalOpen,
      [key]: false,
    });
  };

  useEffect(() => {
    setIsModalOpen({
      addFriend: false,
      channelInvite: false,
      channelCreate: false,
      channelSetting: false,
      enterPassword: false,
      otp: false,
      gameSetting: false,
      gameResult: false,
      gameInvite: false,
    });
  }, []);

  return { isModalOpen, handleModalOpen, handleModalClose };
};

export default ModalHandler;
