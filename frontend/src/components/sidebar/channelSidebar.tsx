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
import { ChannelMember, ContextMenuInfo, DM, MemberRole, SidebarProperty, SidebarProps} from "./sidebarType";


const ChannelSidebar = (prop: SidebarProps) => {
  const [memberList, setMemberList] = useState<ChannelMember[]>([]);
  const [myProfile, setMyProfile] = useState<{ id: number; nickname: string; role: MemberRole}>({
    id: 0,
    nickname: "",
    role: MemberRole.MEMBER,
  });

  const modalHandler = prop.modalHandler;
  const isModalOpen = modalHandler.isModalOpen;
  const handleModalOpen = modalHandler.handleModalOpen;
  const handleModalClose = modalHandler.handleModalClose;

  // first render -> get userList according to sidebarType(prop.title)
  // const addMember = (newMemArr: UserItemProps[]) => {
  //   setUserList(newMemArr);
  // };
  // const removeMember = (leavedArr: UserItemProps[]) => {
  //   setUserList(leavedArr);
  // };

  useEffect(() => {
    getChannelmember();
    // getMyProfile();
  
    // ioChannel.on("channelMemberAdd", (newMember: UserItemProps) => {
    //   if (userList && !userList.some((user) => user.id === newMember.id)) {
    //     const newMemArr = [...userList, newMember];
    //     addMember(newMemArr);
    //   }
    // });

    // ioChannel.on("channelMemberRemove", (userId) => {
    //   if (userList) {
    //     const leavedArr = userList.filter((user) => user.id !== userId);
    //     removeMember(leavedArr);
    //   }
    // });
  }, []);

  const getChannelmember = async () => {
    try {
      const memberList = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/${prop.channelId}/member`);
      console.log(`memberList.data : `, memberList.data);
      setMemberList(memberList.data);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/user/me`,
      );
      const me = memberList.data.find((member: ChannelMember) => {
        return member.userId === response.data.id
      });
      if (me)
        setMyProfile({ id: response.data.id, nickname: response.data.nickname, role: me.role});
    } catch (error) {
      console.log(`[getChannelmember] ${error}`);
    }
  }

  // const getMyProfile = async () => {
  //   try {



  //   } catch (e) {
  //     console.log(`[MyProfile] ${e}`);
  //   }
  // };

  // to contextMenu
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<ContextMenuInfo | null>();

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
    dropdownMenuInfo: ContextMenuInfo
  ) => {
    handleContextMenu(e);
    setResult(dropdownMenuInfo);
  };

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
        {/* TODO: update  */}
        {memberList ? memberList.map((member) => (
          <SidebarItem
            // key={member.id}
            itemType={SidebarProperty.CHAT_MEMBER_LIST}
            contextMenuHandler={contextMenuHandler}
            channelId={prop.channelId}
            userId={myProfile.id}
            userRole={myProfile.role}
            targetId={member.userId}
            targetUser={member.user}
            targetRole={member.role}
          />
        )) : null}
      </ul>

      {show && result?.myRole == MemberRole.MEMBER ? (
        <ChannelMemberDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show && result?.myRole == MemberRole.ADMIN ? (
        <ChannelAdminDropdownList
          anchorPoint={anchorPoint}
          dropdownListInfo={result}
          modalHandler={modalHandler}
        />
      ) : (
        ""
      )}
      {show && result?.myRole == MemberRole.OWNER ? (
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
