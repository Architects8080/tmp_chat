import React from "react";
import NotificationItem from "../dropdown/itemTemplate/notification/item";
import "./dropdown.scss";
import { useNotiState } from "./notificationContext";

//List를 Main에서 불러오면, 리스트 유무에 따른 icon img 변경
//Button을 누르면 Dropdown open.

type DropdownProps = {
  isActive: boolean;
};

function NotificationOverlay(prop: DropdownProps) {
  const NotiList = useNotiState();

  return (
    <div className="notification-wrap">
      <div className={`dropdown ${prop.isActive ? "active" : "inactive"}`}>
        {NotiList.map(noti => (
          <NotificationItem
            title={noti.title}
            description={noti.description}
            acceptCallback={noti.acceptCallback}
            rejectCallback={noti.rejectCallback}
          />
        ))}
      </div>
    </div>
  );
}
export default NotificationOverlay;
