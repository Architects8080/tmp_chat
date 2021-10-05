import { useEffect, useState } from "react";
import { Map } from "typescript";

const ModalHandler = () => {
  // var isModalOpen: {[key: string]: boolean} = {
  //   "addFriend": false,
  //   "chatroomInvite": false,
  //   "chatroomCreate": false,
  //   "chatroomSetting": false,
  //   "enterPassword": false,
  //   "otp": false,
  //   "gameSetting": false,
  //   "gameResult": false,
  //   "gameInvite": false,
  // }

  // const setIsModalOpen = (key: string, value: boolean) => {
  //   isModalOpen[key] = value;
  // }

  // const handleModalOpen = (key: string) => {
  //   setIsModalOpen(key, true);
  // }

  // const handleModalClose = (key: string) => {
  //   setIsModalOpen(key, false);
  // }

  // useEffect(() => {
  //   isModalOpen.addFriend = false;
  //   isModalOpen.chatroomInvite = false;
  //   isModalOpen.chatroomCreate = false;
  //   isModalOpen.chatroomSetting = false;
  //   isModalOpen.enterPassword = false;
  //   isModalOpen.otp = false;
  //   isModalOpen.gameSetting = false;
  //   isModalOpen.gameResult = false;
  //   isModalOpen.gameInvite = false;
  // }, [isModalOpen]);

  const [isModalOpen, setIsModalOpen] = useState({
    addFriend: false,
    chatroomInvite: false,
    chatroomCreate: false,
    chatroomSetting: false,
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
      chatroomInvite: false,
      chatroomCreate: false,
      chatroomSetting: false,
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
