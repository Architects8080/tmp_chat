import axios from "axios";
import React, { useState, useEffect } from "react";
import EnterPasswordModal from "../../../components/modal/chatroom/join/enterPasswordModal";
import ModalHandler from "../../../components/modal/modalhandler";
import { ioChannel } from "../../../socket/socket";
import "./item.scss";

export type ChannelItemProps = {
  id: number,
  title: string,
  memberCount: number,
  type: ChannelType,
}

enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

const ChannelItem = ({channel} : {channel:ChannelItemProps}) => {
  const modalHandler = ModalHandler();
  const [userId, setUserId] = useState(0);

  const handleOnClick = async () => {
    if (channel.type !== ChannelType.PUBLIC) {
      try {
        axios.all([
          axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/me`),
          axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/me`),
        ])
        .then(
          axios.spread((user, myChannelList) => {
            setUserId(user.data.id);
            if (myChannelList.data.find((myChannel: any) => myChannel.id === channel.id))
              window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/chatroom/${channel.id}`
            else
              modalHandler.handleModalOpen("enterPassword");
          })
        );
      }
      catch (e) { console.log(e); }
    } else {
      window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/chatroom/${channel.id}`
    }
  };

  const handleModalClose = () => {
    modalHandler.handleModalClose("enterPassword");
  };

  return (
    <>
      <div className="chatroom-item" onClick={handleOnClick}>
        <div className="chatroom-header">
          <div className="chatroom-title">[{channel.id}] {channel.title}</div>
          { channel.type === ChannelType.PRIVATE ? 
            <img className="chatroom-locked" alt="chatroom-locked" src="/icons/chat/private.svg"/> : ""}
          { channel.type === ChannelType.PROTECTED ? 
            <img className="chatroom-locked" alt="chatroom-locked" src="/icons/chat/protected.svg"/> : ""}
        </div>
        <div className="chatroom-member-count">{channel.memberCount}명 참여중</div>
      </div>
      <EnterPasswordModal open={modalHandler.isModalOpen.enterPassword} close={handleModalClose} userId={userId} roomId={channel.id}/>
    </>
  );
}

export default ChannelItem;
