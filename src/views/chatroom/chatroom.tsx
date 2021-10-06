import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/header";
import SideBar from "../../components/sideBar/sideBar";
import "./chatroom.scss";
import ChatMessage from "./message/message";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef} />;
};

function Chatroom() {
  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <SideBar />
        <div className="chatroom-wrap">
          <div className="chatroom-message-list-wrap">
            <div className="chatroom-message-list">
              {/* map->showing message */}
              <ChatMessage
                isSelfMessage={false}
                nickname="chlee"
                content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              />
              <ChatMessage
                isSelfMessage={true}
                nickname="chlee"
                content="test"
              />
              <ChatMessage
                isSelfMessage={false}
                nickname="chlee"
                content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              />
              <ChatMessage
                isSelfMessage={true}
                nickname="chlee"
                content="test"
              />
              <ChatMessage
                isSelfMessage={true}
                nickname="chlee"
                content="test"
              />
              <AlwaysScrollToBottom />
            </div>
          </div>
          <div className="chatroom-user-input">
            <input
              className="input-field"
              type="text"
              placeholder="내용을 입력하세요"
            />
          </div>
        </div>
      </div>
      <div
        className="button-chatroom-exit"
        onClick={() => {
          window.location.href = "http://localhost:3000/";
        }}
      >
        채팅방 나가기
      </div>
    </>
  );
}

export default Chatroom;
