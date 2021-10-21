import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
  roomId: number;
};

const UnmuteUserItem = (prop: ItemProps) => {
  const handleUnmuteUser = () => {
    io.emit("channel/unmute", prop.roomId, prop.targetId);
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
