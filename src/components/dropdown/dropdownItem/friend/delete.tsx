import React from "react";
import { io } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function DeleteFriendItem(prop: props) {
  const handleDeleteFriend = () => {
    io.emit("friend/delete", prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="친구 끊기"
      color="red"
      callback={handleDeleteFriend}
    />
  );
}

export default DeleteFriendItem;
