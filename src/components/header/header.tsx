import axios from "axios";
import React, { useEffect, useState } from "react";
import NotificationOverlay from "../notification/dropdown";
import ProfileMenu from "../profile/dropdown";
import "./header.scss";

enum NotifyIconURL {
  on = "/icons/notification/on.svg",
  off = "/icons/notification/off.svg",
}

type headerProps = {
  isLoggedIn: boolean;
};

type User = {
  id: number;
  nickname: string;
  intraLogin: string;
  avatar: string;
  status: number;
  ladderPoint: number;
  ladderLevel: number;
};

function Header(prop: headerProps) {
  const [isNotiOverlayActive, setIsNotiOverlayActive] = useState(false);
  const [isProfileMenuActive, setIsProfileMenuActive] = useState(false);
  const [notifyIconURL, setNotifyIconURL] = useState(NotifyIconURL.off);

  const [user, setUser] = useState<User | null>(null);
  const [notiCount, setNotiCount] = useState<number>(0);

  const handleNotifyDropdown = () => {
    console.log(`click!!`);
    setIsNotiOverlayActive(!isNotiOverlayActive);
  };

  const handleProfileDropdown = () => {
    console.log(`test click!!`);
    setIsProfileMenuActive(!isProfileMenuActive);
  };

  useEffect(() => {
    //list check and url setting
    axios
      .all([
        axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/me`),
        axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/notification`),
      ])
      .then(
        axios.spread((userInfo, notiList) => {
          console.log(notiList);
          setUser(userInfo.data);
          setNotiCount(notiList.data.length);

          if (notiList.data.length > 0) setNotifyIconURL(NotifyIconURL.on);
        })
      );
  }, []);

  const updateNotiCount = (notiCount: number) => {
    setNotiCount(notiCount);
    setNotifyIconURL(NotifyIconURL.off);
    if (notiCount > 0) setNotifyIconURL(NotifyIconURL.on);
  };

  return (
    <div>
      <NotificationOverlay
        isActive={isNotiOverlayActive}
        nicknameLength={user ? user.nickname.length : 0}
        updateIcon={updateNotiCount}
      />
      <ProfileMenu isActive={isProfileMenuActive} />
      <header>
        <div
          className="title"
          onClick={() => {
            if (prop.isLoggedIn)
              window.location.href = "http://localhost:3000/main";
          }}
        >
          {" 42 Pong Pong "}
        </div>
        {prop.isLoggedIn && user ? (
          <>
            <div className="notification-icon">
              <img
                className="notification-trigger"
                alt="notification-trigger"
                src={notifyIconURL}
                onClick={handleNotifyDropdown}
              />
            </div>
            <div className="profile-icon" onClick={handleProfileDropdown}>
              <div className="user-nickname">{user.nickname}</div>
              <img
                className="user-avatar"
                alt="user-avatar"
                src={user.avatar}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </header>
    </div>
  );
}

export default Header;
