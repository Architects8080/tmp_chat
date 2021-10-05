import React from "react";
import { status } from "../sideBarType";
import "./user.scss";

type userItemProps = {
  avatar: string;
  status: status;
  nickname: string;
};

function UserItem(prop: userItemProps) {
  return (
    <div className="user-item-wrap">
      <div className="user-photo-wrap">
        <img className="avatar" src={prop.avatar} alt="cannot loaded avatar" />
        <img className="status" src={prop.status} alt="cannot loaded status" />
      </div>
      <div className="nickname">{prop.nickname}</div>
    </div>
  );
}

export default UserItem;
