import axios from "axios";
import React, { useState, useEffect } from "react";
import EnterPasswordModal from "../../../components/modal/chatroom/join/enterPasswordModal";
import { ioChannel } from "../../../socket/socket";
import "./item.scss";

export type chatroomItemProps = {
  roomId: number,
  title: string,
  memberCount: number,
  isProtected: boolean
}

const ChatroomItem = ({channel} : {channel:any}) => {
  const [modalopen, setModalOpen] = useState(false);

  const handleOnClick = async () => {
    if (channel.isProtected) {
      try {
        const response = await axios.get(`http://localhost:5000/channel/me`, { withCredentials: true });
        if (response.data.find((mychannel: any) => mychannel.roomId === channel.roomId)) {
          window.location.href = `http://localhost:3000/chatroom/${channel.roomId}`
        } else
          setModalOpen(true);
      }
      catch (e) { console.log(e); }
    } else
      window.location.href = `http://localhost:3000/chatroom/${channel.roomId}`
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="chatroom-item" onClick={handleOnClick}>
        <div className="chatroom-header">
          <div className="chatroom-title">{channel.title}</div>
          { channel.isProtected ? <img className="chatroom-locked" alt="chatroom-locked" src="/icons/lock.svg"/> : ""}
        </div>
        <div className="chatroom-member-count">{channel.memberCount}명 참여중</div>
      </div>
      {modalopen ? <EnterPasswordModal open={modalopen} close={handleModalClose} roomId={channel.roomId}/> : ""}
    </>
  );
}

export default ChatroomItem;
