import React from "react";
import LogoutItem from "../dropdownItem/header/logout";
import SettingItem from "../dropdownItem/header/setting";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";

function HeaderDropdownList() {
  return (
    <div className="dropdown-list-wrap dropdown-header">
      <ViewProfileItem/>
      <SettingItem/>
      <LogoutItem/>
    </div>
  );
}

export default HeaderDropdownList;
