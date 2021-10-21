import React from "react";
import { io } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

const LogoutItem = () => {
  const handleLogout = () => {
    io.emit("logout"); //TODO
  };

  return (
    <DefaultDropdownItem
      title="로그아웃"
      color="black"
      callback={handleLogout}
    />
  );
}

export default LogoutItem;
