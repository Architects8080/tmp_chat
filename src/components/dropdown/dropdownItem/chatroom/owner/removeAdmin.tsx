import React from "react";
import DefaultDropdownItem from "../../../itemTemplate/default/item";

function RemoveAdminItem() {
  return (
    <DefaultDropdownItem
      title="어드민 권한 제거하기"
      color="red"
      callback={() => {}}
    />
  );
}

export default RemoveAdminItem;
