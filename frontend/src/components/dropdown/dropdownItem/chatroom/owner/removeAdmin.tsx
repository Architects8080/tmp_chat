import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type props = {
  targetId: number;
  roomId: number;
};

function RemoveAdminItem(prop: props) {
  const handleAddAdmin = () => {
    io.emit("channel/admin/delete", prop.roomId, prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="어드민 권한 제거하기"
      color="red"
      callback={handleAddAdmin}
    />
  );
}

export default RemoveAdminItem;
