<<<<<<< HEAD
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EnterPasswordModal from '../../../components/modal/chatroom/join/enterPasswordModal';
import { ioChannel } from '../../../socket/socket';
import './item.scss';
=======
import axios from "axios";
import React, { useState, useEffect } from "react";
import EnterPasswordModal from "../../../components/modal/chatroom/join/enterPasswordModal";
import ModalHandler from "../../../components/modal/modalhandler";
import { ioChannel } from "../../../socket/socket";
import "./item.scss";
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

export type chatroomItemProps = {
  roomId: number,
  title: string,
  memberCount: number,
  isProtected: boolean
}
<<<<<<< HEAD

const ChatroomItem = ({channel} : {channel:any}) => {
=======
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

const ChatroomItem = ({channel} : {channel:any}) => {
  const modalHandler = ModalHandler();

<<<<<<< HEAD
  const handleOnClick = () => {
    if (channel.isProtected)
      setModalOpen(true);
    else
      ioChannel.emit("joinChannel", channel.roomId);
  }
=======
  const handleOnClick = async () => {
    if (channel.isProtected) {
      try {
        const response = await axios.get(`http://localhost:5000/channel/me`, { withCredentials: true });
        if (response.data.find((mychannel: any) => mychannel.roomId === channel.roomId)) {
          window.location.href = `http://localhost:3000/chatroom/${channel.roomId}`
        } else
          modalHandler.handleModalOpen("enterPassword");
      }
      catch (e) { console.log(e); }
    } else
      window.location.href = `http://localhost:3000/chatroom/${channel.roomId}`
  };
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

  const handleModalClose = () => {
    modalHandler.handleModalClose("enterPassword");
  };

  return (
    <Link to={`/chatroom/${channel.roomId}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <div className="chatroom-item" onClick={handleOnClick}>
        <div className="chatroom-header">
          <div className="chatroom-title">{channel.title}</div>
          { channel.isProtected ? <img className="chatroom-locked" alt="chatroom-locked" src="/icons/lock.svg"/> : ""}
        </div>
        <div className="chatroom-member-count">{channel.memberCount}명 참여중</div>
      </div>
<<<<<<< HEAD
      {modalopen ? <EnterPasswordModal open={modalopen} close={handleModalClose}/> : ""}
    </Link>
=======
      <EnterPasswordModal open={modalHandler.isModalOpen.enterPassword} close={handleModalClose} roomId={channel.roomId}/>
    </>
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
  );
}

export default ChatroomItem;
