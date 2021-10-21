import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
  roomId: number;
};

const AddAdminItem = (prop: ItemProps) => {
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
