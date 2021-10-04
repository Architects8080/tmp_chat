import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EnterPasswordModal from '../../../components/modal/chatroom/join/enterPasswordModal';
import { ioChannel } from '../../../socket/socket';
import './item.scss';

export type chatroomItemProps = {
  roomId: number,
  title: string,
  memberCount: number,
  isProtected: boolean
}

const ChatroomItem = ({channel} : {channel:any}) => {

  const [modalopen, setModalOpen] = useState(false);

  const handleOnClick = () => {
    if (channel.isProtected)
      setModalOpen(true);
    else
      ioChannel.emit("joinChannel", channel.roomId);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  }

  return (
    <Link to={`/chatroom/${channel.roomId}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <div className="chatroom-item" onClick={handleOnClick}>
        <div className="chatroom-header">
          <div className="chatroom-title">{channel.title}</div>
          { channel.isProtected ? <img className="chatroom-locked" alt="chatroom-locked" src="/icons/lock.svg"/> : ""}
        </div>
        <div className="chatroom-member-count">{channel.memberCount}명 참여중</div>
      </div>
      {modalopen ? <EnterPasswordModal open={modalopen} close={handleModalClose}/> : ""}
    </Link>
  );
}

export default ChatroomItem;