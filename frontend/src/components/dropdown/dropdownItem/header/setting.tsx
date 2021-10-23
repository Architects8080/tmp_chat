import React from "react";
import DefaultDropdownItem from "../../itemTemplate/default/item";

const SettingItem = () => {
  return (
    <DefaultDropdownItem
      title="환경 설정"
      color="black"
      callback={() => {
        window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/setting`;
      }}
    />
  );
}

export default SettingItem;
