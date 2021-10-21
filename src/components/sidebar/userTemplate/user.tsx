import React from "react";
import { Status } from "../sidebarType";
import "./user.scss";

type UserItemProps = {
  avatar: string;
  status: number;
  nickname: string;
};

const UserItem = (prop: UserItemProps) => {
  const userStatus =
    prop.status === 0
      ? Status.OFFLINE
      : prop.status === 1
      ? Status.ONLINE
      : Status.INGAME;

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
        <img className="status" src={userStatus} alt="cannot loaded status" />
      </div>
      <div className="nickname">{prop.nickname}</div>
    </div>
  );
}

export default UserItem;
