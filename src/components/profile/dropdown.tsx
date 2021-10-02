import React from "react";
import HeaderDropdownList from "../dropdown/dropdownList/header";
import "./dropdown.scss";

type DropdownProps = {
  isActive: boolean;
};

function ProfileMenu(prop: DropdownProps) {
  return (
    <div className="profile-menu-wrap">
      <div className={`dropdown ${prop.isActive ? "active" : "inactive"}`}>
        <HeaderDropdownList />
      </div>
    </div>
  );
}

export default ProfileMenu;
