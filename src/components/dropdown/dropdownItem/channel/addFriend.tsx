import React from "react";
import { io } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
};

const AddFriendItem = (prop: ItemProps) => {
  const handleAddFriend = () => {
    io.emit("friend/add", prop.targetId); //TODO
  };

  return (
    <DefaultDropdownItem
      title="친구 추가하기"
      color="black"
      callback={handleAddFriend}
    />
  );
}

export default AddFriendItem;
