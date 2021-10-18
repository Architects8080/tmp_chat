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
  const [userList, setUserList] = useState<userItemProps[]>([]);
  // use UserAPI to get userId;

  const modalHandler = prop.modalHandler;
  const isModalOpen = modalHandler.isModalOpen;
  const handleModalOpen = modalHandler.handleModalOpen;
  const handleModalClose = modalHandler.handleModalClose;

  // first render -> get userList according to sidebarType(prop.title)

  useEffect(() => {
    if (prop.title === sidebarProperty.chatMemberList)
      getChannelmember();
    else if (prop.title === sidebarProperty.friendList)
      fetchFriendList();
    else if (prop.title === sidebarProperty.observerList)
      ioChannel.emit("observerList", prop.roomId);
  }, []);

  useEffect(() => {
    if (prop.title === sidebarProperty.chatMemberList) {
      ioChannel.on("channelMemberAdd", (newMember: userItemProps) => {
        getChannelmember();
        // setUserList([...userList.filter(user => user.id != newMember.id), newMember]);
      });
      ioChannel.on("channelMemberRemove", (userId) => {
        getChannelmember();
        // setUserList(userList.filter(user => user.id != userId));
      });
    }

    if (prop.title === sidebarProperty.friendList) {
      //친구 수락 수신
      ioCommunity.on("friendAcceptToClient", async (friendID: number) => {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS}/user/${friendID}`,
          { withCredentials: true, }
        );
        setUserList(userList => [...userList, {
          id: friendID,
          avatar: response.data.avatar,
          status: 1,
          nickname: response.data.nickname,
          alert: false,
        }]);
      });
    
      //친구 차단 수신
      ioCommunity.on("blockResponseToClient", async (friendID: number) => {
        setUserList(userList => userList.filter(user => user.id !== friendID));
      });
    
      //친구or차단 취소 수신
      ioCommunity.on("relationDeleteToClient",
      async (id: number, isFriendly: boolean) => {
        if (isFriendly)
          setUserList(userList => userList.filter(user => user.id !== id));
        else {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_SERVER_ADDRESS}/community/${id}`,
              { withCredentials: true }
            );
            if (response)
              setUserList(userList => [...userList, {
                id: id,
                avatar: response.data.avatar,
                status: 1,
                nickname: response.data.nickname,
                alert: false,
              }]);
          } catch (e) {
            console.log(`[relationDeleteToClient] ${e}`);
          }
        }
      });
    }
  }, [userList]);

  const getChannelmember = async () => {
    const data = await axios.get(
      process.env.REACT_APP_SERVER_ADDRESS + `/channel/members/${prop.roomId}`,
    );
    setUserList(data.data);
  }

  // FriendList func
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
        id: user.other.id,
        avatar: user.other.avatar,
        status: 1,
        nickname: user.other.nickname,
        alert: false,
      }));
      console.log(newUserList);
      if (prop.title === sidebarProperty.friendList)
        setUserList(newUserList);
    } catch (e) {
      console.log(`[FriendListError] ${e}`);
    }
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
          targetId={item.id} />
        ) : null}
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
