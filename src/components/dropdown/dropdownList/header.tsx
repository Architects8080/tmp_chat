import React from "react";
import SettingItem from "../dropdownItem/header/setting";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";

function HeaderDropdownList() {
  return (
    <div className="dropdown-list-wrap dropdown-header">
      <ViewProfileItem />
      <SettingItem />
    </div>
  );
}

export default HeaderDropdownList;
