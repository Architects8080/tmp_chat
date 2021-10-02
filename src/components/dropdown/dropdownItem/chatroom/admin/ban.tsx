import React from "react";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

function BanUserItem() {
  return (
    <DefaultDropdownItem
      title="이 방에서 추방하기 (Ban)"
      color="red"
      callback={() => {}}
    />
  );
}

export default BanUserItem;
