import React from "react";
import NotificationItem from "../dropdown/itemTemplate/notification/item";
import "./dropdown.scss";

//List를 Main에서 불러오면, 리스트 유무에 따른 icon img 변경
//Button을 누르면 Dropdown open.

type DropdownProps = {
  isActive: boolean;
};

function NotificationOverlay(prop: DropdownProps) {
  return (
    <div className="notification-wrap">
      <div className={`dropdown ${prop.isActive ? "active" : "inactive"}`}>
        <NotificationItem
          title="test"
          description="verylongdescriptionverylongdescriptionverylongdescriptionverylongdescription"
          acceptCallback={() => {}}
          rejectCallback={() => {}}
        />
        <NotificationItem
          title="test"
          description="description"
          acceptCallback={() => {}}
          rejectCallback={() => {}}
        />
        <NotificationItem
          title="test"
          description="description"
          acceptCallback={() => {}}
          rejectCallback={() => {}}
        />
        <NotificationItem
          title="test"
          description="description"
          acceptCallback={() => {}}
          rejectCallback={() => {}}
        />
        <NotificationItem
          title="test"
          description="description"
          acceptCallback={() => {}}
          rejectCallback={() => {}}
        />
      </div>
    </div>
  );
}
export default NotificationOverlay;
