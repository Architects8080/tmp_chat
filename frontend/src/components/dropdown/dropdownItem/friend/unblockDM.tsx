import React from "react";
import { ioCommunity } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function UnblockDMItem(prop: props) {
  const handleUnblockDM = () => {
    ioCommunity.emit("relationDeleteToServer", {
      otherID: prop.targetId,
      isFriendly: false
    });
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
