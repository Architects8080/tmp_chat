import React, { useState } from "react";
import EnterPasswordModal from "../../../components/modal/chatroom/join/enterPasswordModal";
import "./item.scss";

type chatroomItemProps = {
  roomId: number;
  title: string;
  memberCount: number;
  isProtected: boolean;
};
function ChatroomItem(prop: chatroomItemProps) {
  const [modalopen, setModalOpen] = useState(false);

  const handleOnClick = () => {
    if (prop.isProtected) setModalOpen(true);
    else console.log("io.emit join!!");
    //io.emit(join, prop.roomId);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="chatroom-item" onClick={handleOnClick}>
        <div className="chatroom-header">
          <div className="chatroom-title">{prop.title}</div>
          {prop.isProtected ? (
            <img
              className="chatroom-locked"
              alt="chatroom-locked"
              src="/icons/lock.svg"
            />
          ) : (
            ""
          )}
        </div>
        <div className="chatroom-member-count">{prop.memberCount}명 참여중</div>
      </div>
      {modalopen ? (
        <EnterPasswordModal open={modalopen} close={handleModalClose} />
      ) : (
        ""
      )}
    </>
  );
}

export default ChatroomItem;
