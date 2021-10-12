import React from "react";
import { status } from "../sideBarType";
import "./user.scss";

type userItemProps = {
  avatar: string;
  status: number;
  nickname: string;
};

function UserItem(prop: userItemProps) {
  const userStatus = prop.status === 0 ? status.offline : prop.status === 1 ? status.online : status.ingame;
  return (
    <div className="user-item-wrap">
      <div className="user-photo-wrap">
        <img className="avatar" src={prop.avatar} alt="cannot loaded avatar" />
        <img className="status" src={userStatus} alt="cannot loaded status" />
      </div>
      <div className="nickname">{prop.nickname}</div>
    </div>
  );
}

export default UserItem;
