import React, { useState } from "react";
import GameSettingModal from "../../modal/game/gameSettingModal";
import { modalHandler } from "../../sidebar/sidebarType";
import DefaultDropdownItem from "../itemTemplate/default/item";

type props = {
  targetId: number;
  modalHandler: modalHandler;
};

function InviteGameItem(prop: props) {
  // const handleModalOpen = prop.modalHandler.handleModalOpen;
  // const handleModalClose = prop.modalHandler.handleModalClose;

  //to avoid window close
  const isModalOpen = prop.modalHandler.isModalOpen;
  const [test, setTest] = useState(isModalOpen.gameSetting);

  const handleModalOpen = () => {
    setTest(true);
    isModalOpen.gameSetting = true;
  };

  const handleModalClose = () => {
    setTest(false);
    isModalOpen.gameSetting = false;
  };

  return (
    <>
      <GameSettingModal
        open={test}
        close={handleModalClose}
        targetId={prop.targetId} //TODO
      />
      <DefaultDropdownItem
        title="게임 초대하기"
        color="black"
        callback={handleModalOpen}
      />
    </>
  );
}

export default InviteGameItem;
