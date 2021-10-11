import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ioChannel, ioCommunity } from "../../socket/socket";
import ChatroomAdminDropdownList from "../dropdown/dropdownList/chatroomAdmin";
import ChatroomDefaultDropdownList from "../dropdown/dropdownList/chatroomDefault";
import ChatroomOwnerDropdownList from "../dropdown/dropdownList/chatroomOwner";
import FriendDropdownList from "../dropdown/dropdownList/friend";
import ChatroomInviteModal from "../modal/chatroom/invite/chatroomInviteModal";
import ChatroomSettingModal from "../modal/chatroom/setting/chatroomSettingModal";
import AddFriendModal from "../modal/friend/add/addFriendModal";
import { useNotiDispatch } from "../notification/notificationContext";
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
  status,
  userItemProps,
} from "./sideBarType";

function SideBar(prop: sidebarProps) {
  const notiDispatch = useNotiDispatch();
  const [userList, setUserList] = useState<userItemProps[]>([]);
  // use UserAPI to get userId;

  const modalHandler = prop.modalHandler;
  const isModalOpen = modalHandler.isModalOpen;
  const handleModalOpen = modalHandler.handleModalOpen;
  const handleModalClose = modalHandler.handleModalClose;

  // var userId: number;

  // first render -> get userList according to sidebarType(prop.title)
  // var userList: any;
  useEffect(() => {
    if (prop.title === sidebarProperty.chatMemberList)
      ioChannel.emit("chatMemberList", prop.roomId);
    else if (prop.title === sidebarProperty.friendList)
      fetchFriendList();
    else if (prop.title === sidebarProperty.observerList)
      ioChannel.emit("observerList", prop.roomId);

    // io.on("sidebarItems", userList);
    //친구 요청 수신
    ioCommunity.on("friendRequestToClient", async (friend: number) => {
      const response = await axios.get(
				`${process.env.REACT_APP_SERVER_ADDRESS}/user/${friend}`,
				{
					withCredentials: true,
				}
			);
      notiDispatch({
        type: "ADD",
        Notification: {
          title: "친구 요청",
          description: `${response.data.nickname}님의 친구 신청입니다. 수락하시겠습니까?`,
          acceptCallback: () => {
            ioCommunity.emit("friendAcceptToServer", {friendID: friend});
          },
          rejectCallback: () => {}
        }
      })
    });

    //친구 수락 수신
    ioCommunity.on("friendAcceptToClient", async (friend: number) => {
      const response = await axios.get(
				`${process.env.REACT_APP_SERVER_ADDRESS}/user/${friend}`,
				{
					withCredentials: true,
				}
			);
      setUserList(userList => [...userList, {
        id: friend,
        avatar: response.data.avatar,
        status: status.online,
        nickname: response.data.nickname
      }]);
    });
  }, []);

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

  const fetchFriendList = async () => {
		try {
      let newUserList: userItemProps[] = [];
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_ADDRESS}/community/friend`,
				{
					withCredentials: true,
				}
			);
			response.data.map((user: any) => newUserList.push({
				id: user.otherID,
				avatar: user.other.avatar,
        status: status.online,
        nickname: user.other.nickname
			}));
      console.log(newUserList);
      setUserList(newUserList);
		} catch (e) {
			console.log(`[FriendListError] ${e}`);
		}
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
        {/* itemType: same as prop.title */}
        {userList.map(user => (
          <SidebarItem
            itemType={prop.title}
            itemInfo={user}
            contextMenuHandler={contextMenuHandler}
            roomId={1}
            userId={2}
            targetId={user.id}
          />
        ))}
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
