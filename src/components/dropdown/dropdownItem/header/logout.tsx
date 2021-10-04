import React from "react";
import DefaultDropdownItem from "../../itemTemplate/default/item";

function LogoutItem() {
  return (
    <DefaultDropdownItem
      title="로그아웃"
      color="black"
      callback={() => {
        // window.location.href = "http://localhost:3000/setting";
      }}
    />
  );
}

export default LogoutItem;
