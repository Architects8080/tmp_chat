import React from "react";
import { User } from "../../../views/profile/profileType";
import { DMUser } from "../sidebarType";
import "./user.scss";

const UserItem = (prop: User | DMUser) => {
  return (
    <div className="user-item-wrap">
      <div className="user-photo-wrap">
        <div className="profile">
          <img
            className="avatar"
            src={prop.avatar}
            alt="cannot loaded avatar"
          />
        </div>
        {/* <img className="status" src={prop.status} alt="cannot loaded status" /> */}
      </div>
      <div className="nickname">{prop.nickname}</div>
    </div>
  );
}

export default UserItem;
