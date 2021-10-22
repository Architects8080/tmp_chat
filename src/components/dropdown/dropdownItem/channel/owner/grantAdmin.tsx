import axios from "axios";
import React from "react";
import { io } from "../../../../../socket/socket";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
  channelId: number;
};

const GrantAdminItem = (prop: ItemProps) => {
  const handleGrantAdmin = async () => {
    await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/${prop.channelId}/admin/${prop.targetId}`);
  };

  return (
    <DefaultDropdownItem
      title="어드민 권한 부여하기"
      color="black"
      callback={handleGrantAdmin}
    />
  );
}

export default GrantAdminItem;
