import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
  roomId: number;
};

const BanUserItem = (prop: ItemProps) => {
  const handleBanUser = () => {
    io.emit("channel/ban", prop.roomId, prop.targetId); //TODO
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
