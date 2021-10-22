import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
  channelId: number;
};

const MuteUserItem = (prop: ItemProps) =>{
  const handleMuteUser = () => {
    io.emit("channel/mute", prop.channelId, prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="이 방에서 차단하기 (Mute)"
      color="red"
      callback={handleMuteUser}
    />
  );
}

export default MuteUserItem;
