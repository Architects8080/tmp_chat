import axios from "axios";
import React, { useState, useEffect } from "react";
import EnterPasswordModal from "../../../components/modal/chatroom/join/enterPasswordModal";
import ModalHandler from "../../../components/modal/modalhandler";
import { ioChannel } from "../../../socket/socket";
import "./item.scss";

export type chatroomItemProps = {
  roomId: number,
  title: string,
  memberCount: number,
  type: ChatroomType,
}

enum ChatroomType {
  public = 0,
  private,
  protected,
}

const ChatroomItem = ({channel} : {channel:chatroomItemProps}) => {
  const modalHandler = ModalHandler();
  const [userId, setUserId] = useState(0);

  const handleOnClick = async () => {
    if (channel.type) {
      try {
        axios.all([
          axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/me`),
          axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/me`),
        ])
        .then(
          axios.spread((user, myChannelList) => {
            setUserId(user.data.id);
            if (myChannelList.data.find((myChannel: any) => myChannel.roomId === channel.roomId))
              window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/chatroom/${channel.roomId}`
            else
              modalHandler.handleModalOpen("enterPassword");
          })
        );
      }
      catch (e) { console.log(e); }
    } else {
      window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/chatroom/${channel.roomId}`
    }
  };

  const handleModalClose = () => {
    modalHandler.handleModalClose("enterPassword");
  };

  return (
    <>
      <div className="chatroom-item" onClick={handleOnClick}>
        <div className="chatroom-header">
          <div className="chatroom-title">[{channel.roomId}] {channel.title}</div>
          { channel.type === ChatroomType.private ? 
            <img className="chatroom-locked" alt="chatroom-locked" src="/icons/chat/private.svg"/> : ""}
          { channel.type === ChatroomType.protected ? 
            <img className="chatroom-locked" alt="chatroom-locked" src="/icons/chat/protected.svg"/> : ""}
        </div>
        <div className="chatroom-member-count">{channel.memberCount}명 참여중</div>
      </div>
      <EnterPasswordModal open={modalHandler.isModalOpen.enterPassword} close={handleModalClose} userId={userId} roomId={channel.roomId}/>
    </>
  );
}

export default ChatroomItem;
