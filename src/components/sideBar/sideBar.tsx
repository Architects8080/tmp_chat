import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { io, ioChannel } from "../../socket/socket";
import ChatroomAdminDropdownList from "../dropdown/dropdownList/chatroomAdmin";
import ChatroomDefaultDropdownList from "../dropdown/dropdownList/chatroomDefault";
import ChatroomOwnerDropdownList from "../dropdown/dropdownList/chatroomOwner";
import FriendDropdownList from "../dropdown/dropdownList/friend";
import ChatroomInviteModal from "../modal/chatroom/invite/chatroomInviteModal";
import ChatroomSettingModal from "../modal/chatroom/setting/chatroomSettingModal";
import AddFriendModal from "../modal/friend/add/addFriendModal";
import AddUserIcon from "./icon/addUser";
import InviteUserIcon from "./icon/inviteUser";
import SettingIcon from "./icon/setting";
import "./sideBar.scss";
import SidebarItem from "./sideBarItem";
import {
  chatroomPermission,
  dropdownMenuInfo,
  sidebarProperty,
  sidebarProps,
  userItemProps,
} from "./sideBarType";

function SideBar(prop: sidebarProps) {
  // use UserAPI to get userId;

  const modalHandler = prop.modalHandler;
  const isModalOpen = modalHandler.isModalOpen;
  const handleModalOpen = modalHandler.handleModalOpen;
  const handleModalClose = modalHandler.handleModalClose;

  var userId: number;

  // first render -> get userList according to sidebarType(prop.title)
  // var userList: any;
  const [userList, setUserList] = useState<userItemProps[]>([]);
  useEffect(() => {

    const getChannelmember = async () => {
      const data = await axios.get(
        process.env.REACT_APP_SERVER_ADDRESS + `/channel/members/${prop.roomId}`,
        { withCredentials: true }
      );
      setUserList(data.data);
    }
    if (prop.title === sidebarProperty.chatMemberList) {
      getChannelmember();
      ioChannel.on("channelMemberAdd", (newMember: userItemProps) => {
        if (!userList.filter(user => user.id === newMember.id))
          setUserList([...userList, newMember]);
      });
      ioChannel.on("channelMemberRemove", (userId) => {
        setUserList(userList.filter(user => user.id !== userId));
      });
    }
    else if (prop.title === sidebarProperty.friendList)
      io.emit("friendList", userId);
    else if (prop.title === sidebarProperty.observerList)
      io.emit("observerList", prop.roomId);

    // io.on("sidebarItems", userList);
    
  }, [userList]);

  // to test
  const tempInfo: userItemProps = {
    id: 1,
    avatar: "https://cdn.intra.42.fr/users/yhan.jpg",
    status: 1,
    nickname: "yhan",
  };

  // to contextMenu
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<dropdownMenuInfo | null>();

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShow(true);
    },
    [setShow, setAnchorPoint]
  );

  const handleClick = useCallback(() => {
    if (show && !isModalOpen.gameSetting) setShow(false);
  }, [show]);

  window.addEventListener("click", handleClick);
  useEffect(() => {
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [isModalOpen]);

  //get dropdownMenuInfo according to user's relation & sidebarType
  const contextMenuHandler = (
    e: React.MouseEvent,
    dropdownMenuInfo: dropdownMenuInfo
  ) => {
    handleContextMenu(e);
    setResult(dropdownMenuInfo);
  };

  return (
    <aside>
      <div className="sidebar-header">
        <div className="sidebar-title">{prop.title}</div>
        <div className="sidebar-icon-list">
          {/* set icon according to sidebarType */}
          {prop.title == sidebarProperty.friendList ? (
            // addFriendModal
            <AddUserIcon
              onClick={() => {
                handleModalOpen("addFriend");
              }}
            />
          ) : prop.title == sidebarProperty.chatMemberList ? (
            // inviteUserModal, chatroomSettingModal (with chatroomId), handler socket
            <>
              <InviteUserIcon
                onClick={() => {
                  handleModalOpen("chatroomInvite");
                }}
              />
              <SettingIcon
                onClick={() => {
                  handleModalOpen("chatroomSetting");
                }}
              />
            </>
          ) : null}
        </div>
      </div>
      <div className="user-list">
        {userList ? 
        userList.map(item => 
          <SidebarItem itemType={prop.title}
          key={item.id}
          itemInfo={item}
          contextMenuHandler={contextMenuHandler}
          roomId={prop.roomId}
          userId={2}
          targetId={3} />
        ) : null}
        <SidebarItem
          itemType={prop.title}
          itemInfo={tempInfo}
          contextMenuHandler={contextMenuHandler}
          roomId={1}
          userId={2}
          targetId={3}
        />
      </div>

      {/* anchorPoint, dropdownMenuInfo, userId, targetId */}
      {show && prop.title === sidebarProperty.friendList && result ? (
        <FriendDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show &&
      prop.title === sidebarProperty.chatMemberList &&
      result?.permission == chatroomPermission.member ? (
        <ChatroomDefaultDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show &&
      prop.title === sidebarProperty.chatMemberList &&
      result?.permission == chatroomPermission.admin ? (
        <ChatroomAdminDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show &&
      prop.title === sidebarProperty.chatMemberList &&
      result?.permission == chatroomPermission.owner ? (
        <ChatroomOwnerDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}

      {isModalOpen.addFriend ? (
        <AddFriendModal
          open={isModalOpen.addFriend}
          close={() => handleModalClose("addFriend")}
        />
      ) : (
        ""
      )}
      {isModalOpen.chatroomInvite ? (
        <ChatroomInviteModal
          open={isModalOpen.chatroomInvite}
          close={() => handleModalClose("chatroomInvite")}
          roomId={prop.roomId}
        />
      ) : (
        ""
      )}
      {isModalOpen.chatroomSetting ? (
        <ChatroomSettingModal
          open={isModalOpen.chatroomSetting}
          close={() => handleModalClose("chatroomSetting")}
          roomId={prop.roomId}
        />
      ) : (
        ""
      )}
    </aside>
  );
}

export default SideBar;
