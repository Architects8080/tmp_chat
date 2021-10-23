import axios from "axios";
import React, { useState, useEffect } from "react";
import EnterPasswordModal from "../../../components/modal/channel/join/enterPasswordModal";
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

  const handleOnClick = async () => {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/me`);

    if (channel.type === ChannelType.PROTECTED && 
        !response.data.find((element: any) => element.id === channel.id)) {
        modalHandler.handleModalOpen("enterPassword");
    }
    else
      window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/channel/${channel.id}`
  };

  const handleModalClose = () => {
    modalHandler.handleModalClose("enterPassword");
  };

  return (
    <>
      <div className="channel-item" onClick={handleOnClick}>
        <div className="channel-header">
          <div className="channel-title">[{channel.id}] {channel.title}</div>
          { channel.type === ChannelType.PRIVATE ? 
            <img className="channel-locked" alt="channel-locked" src="/icons/chat/private.svg"/> : ""}
          { channel.type === ChannelType.PROTECTED ? 
            <img className="channel-locked" alt="channel-locked" src="/icons/chat/protected.svg"/> : ""}
        </div>
        <div className="channel-member-count">{channel.memberCount}명 참여중</div>
      </div>
      <EnterPasswordModal open={modalHandler.isModalOpen.enterPassword} close={handleModalClose} channelId={channel.id}/>
    </>
  );
}

export default ChannelItem;
