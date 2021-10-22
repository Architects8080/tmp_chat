import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ioChannel, ioCommunity } from "../../socket/socket";
import DirectMessage from "../directMessage/directMessage";
import ChannelAdminDropdownList from "../dropdown/dropdownList/channelAdmin";
import ChannelMemberDropdownList from "../dropdown/dropdownList/channelMember";
import ChannelOwnerDropdownList from "../dropdown/dropdownList/channelOwner";
import ChannelInviteModal from "../modal/channel/invite/channelInviteModal";
import ChannelSettingModal from "../modal/channel/setting/channelSettingModal";
import snackbar from "../snackbar/snackbar";
import InviteUserIcon from "./icon/inviteUser";
import SettingIcon from "./icon/setting";
import "./sidebar.scss";
import SidebarItem from "./sidebarItem";
import { DM, DropdownMenuInfo, MemberRole, SidebarProperty, SidebarProps, UserItemProps } from "./sidebarType";


const ChannelSidebar = (prop: SidebarProps) => {
  const [userList, setUserList] = useState<UserItemProps[]>([]);
  const [myProfile, setMyProfile] = useState<{ id: number; nickname: string }>({
    id: 0,
    nickname: "",
  });

  // use UserAPI to get userId;
  const modalHandler = prop.modalHandler;
  const isModalOpen = modalHandler.isModalOpen;
  const handleModalOpen = modalHandler.handleModalOpen;
  const handleModalClose = modalHandler.handleModalClose;

  // first render -> get userList according to sidebarType(prop.title)
  const addMember = (newMemArr: UserItemProps[]) => {
    setUserList(newMemArr);
  };
  const removeMember = (leavedArr: UserItemProps[]) => {
    setUserList(leavedArr);
  };

  useEffect(() => {
    getChannelmember();
    getMyProfile();
    // getNewDM();
  
    ioChannel.on("channelMemberAdd", (newMember: UserItemProps) => {
      if (userList && !userList.some((user) => user.id === newMember.id)) {
        const newMemArr = [...userList, newMember];
        addMember(newMemArr);
      }
    });

    ioChannel.on("channelMemberRemove", (userId) => {
      if (userList) {
        const leavedArr = userList.filter((user) => user.id !== userId);
        removeMember(leavedArr);
      }
    });
  }, []);

  const getChannelmember = async () => {
    try {
      const memberList = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/members/${prop.channelId}`);
      setUserList(memberList.data);
    } catch (error) {
      console.log(`[getChannelmember] ${error}`);
    }
  }

  const getMyProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/user/me`,
      );
      setMyProfile({ id: response.data.id, nickname: response.data.nickname });
    } catch (e) {
      console.log(`[MyProfile] ${e}`);
    }
  };

  // to contextMenu
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<DropdownMenuInfo | null>();

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
    dropdownMenuInfo: DropdownMenuInfo
  ) => {
    handleContextMenu(e);
    setResult(dropdownMenuInfo);
  };

  //DM
  // const [DMopen, setDMOpen] = useState<boolean>(false);
  // const [DMReceiver, setDMReceiver] = useState<UserItemProps>({
  //   id: 0,
  //   avatar: "",
  //   status: 1,
  //   nickname: "",
  //   alert: false,
  // });
  // const DMReceiverRef = useRef<UserItemProps | null>(null);
  // const timerRef = useRef<NodeJS.Timeout>();

  // const getNewDM = () => {
  //   ioCommunity.on("dmToClient", (newDM: DM) => {
  //     if (!DMReceiverRef.current) alertNewDM(newDM.id);
  //   });
  // };

  // const alertNewDM = (senderID: number) => {
  //   setUserList((userList) =>
  //     userList
  //       ? userList.map((user) =>
  //           user.id === senderID ? { ...user, alert: true } : user
  //         )
  //       : userList
  //   );
  //   timerRef.current = setTimeout(() => {
  //     setUserList((userList) =>
  //       userList
  //         ? userList.map((user) =>
  //             user.id === senderID ? { ...user, alert: false } : user
  //           )
  //         : userList
  //     );
  //   }, 1200);
  // };

  // const openDM = (e: React.MouseEvent<HTMLLIElement>) => {
  //   if (userList) {
  //     DMReceiverRef.current = userList.filter(
  //       (user) => user.id === e.currentTarget.value
  //     )[0];

  //     if (DMReceiverRef.current.id == myProfile.id)
  //     {
  //       snackbar.error("자기 자신과의 대화는 불가능합니다.")
  //       return ;
  //     }
  //     setDMReceiver(DMReceiverRef.current);
  //   }

  //   if (timerRef.current) {
  //     if (userList)
  //       userList.map((user) =>
  //         user.id === e.currentTarget.value ? { ...user, alert: true } : user
  //       );
  //     clearTimeout(timerRef.current);
  //   }
  //   if (!DMopen) setDMOpen(true);
  // };

  // const closeDM = () => {
  //   setDMOpen(false);
  //   DMReceiverRef.current = null;
  // };

  return (
    <aside>
      <div className="sidebar-header">
        <div className="sidebar-title">{SidebarProperty.CHAT_MEMBER_LIST}</div>
        <div className="sidebar-icon-list">
          <InviteUserIcon onClick={() => {handleModalOpen("channelInvite");}}/>
          <SettingIcon onClick={() => {handleModalOpen("channelSetting");}}/>
        </div>
      </div>
      <ul className="user-list">
        {userList ? userList.map((user) => (
          // <li onClick={openDM} value={user.id}>
            // {user.alert && <span className="alert-overlay"></span>}
            <SidebarItem
              key={user.id}
              itemType={SidebarProperty.CHAT_MEMBER_LIST}
              itemInfo={user}
              contextMenuHandler={contextMenuHandler}
              channelId={prop.channelId}
              userId={myProfile.id}
              targetId={user.id}
            />
          // </li>
        )) : null}
      </ul>
      {/* {DMopen && (
        <DirectMessage
          myProfile={myProfile}
          DMReceiver={DMReceiver}
          DMReceiverRef={DMReceiverRef}
          closeDM={closeDM}
          alertNewDM={alertNewDM}
        />
      )} */}

      {show && result?.permission == MemberRole.MEMBER ? (
        <ChannelMemberDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show && result?.permission == MemberRole.ADMIN ? (
        <ChannelAdminDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show && result?.permission == MemberRole.OWNER ? (
        <ChannelOwnerDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}

      {/* Modal */}
      <ChannelInviteModal
        open={isModalOpen.channelInvite}
        close={() => handleModalClose("channelInvite")}
        channelId={prop.channelId}/>
      <ChannelSettingModal
        open={isModalOpen.channelSetting}
        close={() => handleModalClose("channelSetting")}
        channelId={prop.channelId}/>
    </aside>
  );
}

export default ChannelSidebar;
