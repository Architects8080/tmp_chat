import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type props = {
  targetId: number;
  roomId: number;
};

function BanUserItem(prop: props) {
  const handleBanUser = () => {
    io.emit("chatroom/ban", prop.roomId, prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="이 방에서 추방하기 (Ban)"
      color="red"
      callback={handleBanUser}
    />
  );
}

export default BanUserItem;
