import axios from "axios";
import React, { useEffect, useState } from "react";
import NotificationOverlay from "../notification/dropdown";
import ProfileMenu from "../profile/dropdown";
import "./header.scss";

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
  const [notifyIconURL, setNotifyIconURL] = useState({
    on: "/icons/notification/on.svg",
    off: "/icons/notification/off.svg",
  });

  const [user, setUser] = useState<User | null>(null);

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
        axios.get("http://localhost:5000/user/me", { withCredentials: true }),
        // axios.get("http://localhost:5000/notification/", { withCredentials: true }),
      ])
      .then(
        axios.spread((userInfo) => {
          setUser(userInfo.data);
        })
      )
  }, []);

  return (
    <div>
      <NotificationOverlay isActive={isNotiOverlayActive} nicknameLength={user ? user.nickname.length : 0} />
      <ProfileMenu isActive={isProfileMenuActive}/>
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
                src={notifyIconURL.on}
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
