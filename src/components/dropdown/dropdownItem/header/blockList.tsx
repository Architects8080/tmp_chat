import React from "react";
import { io } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

const BlockListItem = () => {
  const handleRedirect = () => {
    window.location.href = process.env.REACT_APP_CLIENT_ADDRESS + "/blocklist";
  };

  return (
    <DefaultDropdownItem
      title="차단 목록 보기"
      color="black"
      callback={handleRedirect}
    />
  );
}

export default BlockListItem;
