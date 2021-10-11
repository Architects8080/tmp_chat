import axios from "axios";
import React from "react";
import { io } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

const testUser:number = 3;

function BlockDMItem(prop: props) {
  const handleBlockDM = async () => {
    await axios.post(
      `${process.env.REACT_APP_SERVER_ADDRESS}/community/block`,
      { userID: testUser, otherID: prop.targetId },
      { withCredentials: true }
    );
  };

  return (
    <DefaultDropdownItem
      title="DM 차단하기 (Block)"
      color="red"
      callback={handleBlockDM}
    />
  );
}

export default BlockDMItem;
