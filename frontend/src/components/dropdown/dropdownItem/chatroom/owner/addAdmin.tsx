import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type props = {
  targetId: number;
  roomId: number;
};

function AddAdminItem(prop: props) {
  const handleAddAdmin = () => {
    io.emit("channel/admin/add", prop.roomId, prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="어드민 권한 부여하기"
      color="black"
      callback={handleAddAdmin}
    />
  );
}

export default AddAdminItem;
