import axios from "axios";
import React, { useEffect } from "react";
import LogoutItem from "../dropdownItem/header/logout";
import SettingItem from "../dropdownItem/header/setting";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";

function HeaderDropdownList() {
  var userId = 0;
  useEffect(() => {
    axios
      .get("http://localhost:5000/user/me", { withCredentials: true })
      .then((response) => {
        userId = response.data.id;
      });
  }, []);

  return (
    <div className="dropdown-list-wrap dropdown-header">
      <ViewProfileItem targetId={userId} />
      <SettingItem />
      <LogoutItem />
    </div>
  );
}

export default HeaderDropdownList;
