import React from "react";
import { io } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function UnblockDMItem(prop: props) {
  const handleUnblockDM = () => {
    io.emit("dm/unblock", prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="DM 차단 해제하기"
      color="black"
      callback={handleUnblockDM}
    />
  );
}

export default UnblockDMItem;
