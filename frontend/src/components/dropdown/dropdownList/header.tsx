import axios from "axios";
import React, { useEffect, useState } from "react";
import BlockListItem from "../dropdownItem/header/blockList";
import LogoutItem from "../dropdownItem/header/logout";
import SettingItem from "../dropdownItem/header/setting";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";

type User = {
  id: number;
  nickname: string;
  intraLogin: string;
  avatar: string;
  status: number;
  ladderPoint: number;
  ladderLevel: number;
};

function HeaderDropdownList() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      });
  }, []);

  return (
    <>
      { user ?
        <div className="dropdown-list-wrap dropdown-header">
          <ViewProfileItem targetId={user.id} />
          <SettingItem /> 
          <BlockListItem />
          <LogoutItem />
        </div>
        : ""
      }
    </>
  );
}

export default HeaderDropdownList;
