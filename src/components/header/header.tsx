import React, { useEffect, useState } from "react";
import NotificationOverlay from "../notification/dropdown";
import ProfileMenu from "../profile/dropdown";
import "./header.scss";

type headerProps = {
  isLoggedIn: boolean;
};

function Header(prop: headerProps) {
  const [isNotiOverlayActive, setIsNotiOverlayActive] = useState(false);
  const [isProfileMenuActive, setIsProfileMenuActive] = useState(false);
  const [notifyIconURL, setNotifyIconURL] = useState({
    on: "/icons/notification/on.svg",
    off: "/icons/notification/off.svg",
  });

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
    //if (~) setNotifyIconURL('/icons/notification/true.png');
  }, []);

  return (
    <div>
      <NotificationOverlay isActive={isNotiOverlayActive} />
      <ProfileMenu isActive={isProfileMenuActive} />
      <header>
        <div
          className="title"
          onClick={() => {
            if (prop.isLoggedIn)
              window.location.href = "http://localhost:3000/main";
          }}
        >
          {" "}
          42 Pong Pong{" "}
        </div>
        {prop.isLoggedIn ? (
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
              <div className="user-nickname">chlee</div>
              <img
                className="user-avatar"
                alt="user-avatar"
                src="https://cdn.intra.42.fr/users/chlee.png"
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
