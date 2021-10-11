import axios from "axios";
import React from "react";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function DeleteFriendItem(prop: props) {
  const handleDeleteFriend = async () => {
    try {
			await axios.delete(
				`${process.env.REACT_APP_SERVER_ADDRESS}/community/friend?otherID=${prop.targetId}`, {
          withCredentials: true,
        }
			);
		} catch (e) {
			console.log(`[DeleteFriendItemError] ${e}`);
		}
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
