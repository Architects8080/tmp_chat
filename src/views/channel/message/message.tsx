import React from "react";
import "./message.scss";

type ChatMessageProp = {
  isSelfMessage: boolean;
  nickname: string;
  content: string;
};

const ChatMessage = (prop: ChatMessageProp) => {
  return (
    <>
      {!prop.isSelfMessage ? (
        <div className="other-message-wrap">
          <img className="other-message-avatar" />
          <div className="other-message-content">
            <div className="message-username">{prop.nickname}</div>
            <div className="message-content">{prop.content}</div>
          </div>
        </div>
      ) : (
        <div className="self-message-wrap">
          <div className="self-message-content">
            <div className="message-username">{prop.nickname}</div>
            <div className="message-content">{prop.content}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatMessage;
