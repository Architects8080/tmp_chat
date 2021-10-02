import React from "react";
import "./message.scss";

type chatMessageProp = {
  isSelfMessage: boolean;
  nickname: string;
  content: string;
};

function ChatMessage(prop: chatMessageProp) {
  return (
    <>
      {!prop.isSelfMessage ? (
        <div className="other-message-wrap">
          <img className="other-message-avater" />
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
