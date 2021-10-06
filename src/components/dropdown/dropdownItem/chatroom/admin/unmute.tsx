import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type props = {
  targetId: number;
  roomId: number;
};

function UnmuteUserItem(prop: props) {
  const handleUnmuteUser = () => {
    io.emit("chatroom/unmute", prop.roomId, prop.targetId);
  };

  return (
    <DefaultDropdownItem
      title="이 방에서 차단 해제하기 (Unmute)"
      color="red"
      callback={handleUnmuteUser}
    />
  );
}

export default UnmuteUserItem;
