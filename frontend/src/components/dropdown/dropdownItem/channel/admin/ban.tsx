import axios from "axios";
import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
  channelId: number;
};

const BanUserItem = (prop: ItemProps) => {
  const handleBanUser = async () => {
    await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/${prop.channelId}/ban/${prop.targetId}`);
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
