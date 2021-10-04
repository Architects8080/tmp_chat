import React, { useCallback, useEffect, useState } from "react";
import { io } from "../../socket/socket";
import ChatroomAdminDropdownList from "../dropdown/dropdownList/chatroomAdmin";
import FriendDropdownList from "../dropdown/dropdownList/friend";
import AddUserIcon from "./icon/addUser";
import InviteUserIcon from "./icon/inviteUser";
import SettingIcon from "./icon/setting";
import "./sideBar.scss";
import SidebarItem from "./sideBarItem";
import { sidebarProperty, status, userItemProps} from "./sideBarType";
import UserItem from "./userTemplate/user";

type sidebarProps = {
  title: sidebarProperty;
  // roomId: number | null;
};

function SideBar(prop: sidebarProps) {

  // useEffect(()=>{
  //   if (prop.title === sidebarProperty.chatMemberList)
  //     io.emit('chatMemberList', chatroomId);
  //   else if (prop.title === sidebarProperty.friendList)
  //     io.emit('friendList', userId);
  //   else if (prop.title === sidebarProperty.observerList)
  //     io.emit('observerList', gameroomId);

  //   io.on('sidebarItems', items_object);
  // }, []);

  const tempType: userItemProps = {
    avatar: "https://cdn.intra.42.fr/users/yhan.jpg",
    status: status.online,
    nickname: "yhan"
  }

  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(null);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    setAnchorPoint({ x: event.pageX, y: event.pageY });
    setShow(true);
  }, [setShow, setAnchorPoint]);

  const handleClick = useCallback(() => {
    if (show)
      setShow(false);
  }, [show]);

  window.addEventListener("click", handleClick)
  useEffect(() => {
    return () => {
      window.removeEventListener("click", handleClick);
    }
  }, []);

  //dropdown menu info
  const contextMenuHandler = (e: React.MouseEvent, result: any) => {
    handleContextMenu(e);
    console.log(result);
  }

  return (
    <aside>
      <div className="sidebar-header">
        <div className="sidebar-title">
          {prop.title}
        </div>
        <div className="sidebar-icon-list">
          {
            prop.title == sidebarProperty.friendList ? 
              // addFriendModal
              <AddUserIcon onClick={()=>{}}/>
            : prop.title == sidebarProperty.chatMemberList ?
              // inviteUserModal, chatroomSettingModal (with chatroomId), handler socket
              <>
                <InviteUserIcon onClick={()=>{}}/>
                <SettingIcon onClick={()=>{}}/>
              </>
            : null
          }
        </div>
      </div>
      <div className="user-list">
        {/* itemProps & userid & otherId */}
        <SidebarItem itemType={sidebarProperty.friendList} itemInfo={tempType} contextMenuHandler={contextMenuHandler} />
      </div>
      { show && prop.title === sidebarProperty.friendList ? <ChatroomAdminDropdownList {...anchorPoint}/> : ""}
    </aside>
  );
}

export default SideBar;
