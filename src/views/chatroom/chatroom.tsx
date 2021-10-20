import React from "react";
import * as uuid from 'uuid';
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/header";
import ModalHandler from "../../components/modal/modalhandler";
import { sidebarProperty } from "../../components/sidebar/sidebarType";
import ChatMessage from "./message/message";
import { ioChannel } from "../../socket/socket";
import "./chatroom.scss";
import GameModalListener from "../../components/modal/gameModalListener";
import ChatroomSidebar from "../../components/sidebar/chatroomSidebar";

// 서버로부터 받아서 message state 에 넣을 때 들어가는 형태
type Message = {
  id: string;
  name: string;
  text: string;
};

// 서버로부터 받는 메시지 형태
type Payload = {
  id: number;
  name: string;
  text: string;
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef} />;
};

const Chatroom = () => {
  const modalHandler = ModalHandler();
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [text, setText] = useState('');
  let { id } : any = useParams();

  useEffect(() => {
    function receivedMessage(message: Payload) {
      const newMessage: Message = {
        id: uuid.v4(),
        name: message.name,
        text: message.text,
      };
      setMessages([...messages, newMessage]);
    }
    //post joinChannel -> data 없이 
    //결과값 따라서 false면 아래 alert 가져와서 하고
    //true면 sidebar socket
    //useeefect 끝날때 return () => {} -> unsubscribe 
    ioChannel.emit("joinChannel", id);
    ioChannel.on("joinRefused", () => {
      window.location.href = "http://localhost:3000/main";
      window.alert("비정상적인 접근입니다");
    });
    ioChannel.on('msgToClient', (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, id]);

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || text === '')
			return;
		const newMessageSend = {
      roomId: id,
      text: text,
		};
		ioChannel.emit('msgToChannel', newMessageSend);
		setText('');
	}

  const leaveChannel = () => {
    //post 
    ioChannel.emit("leaveChannel", id);
    window.location.href = "http://localhost:3000/main";
  }

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <ChatroomSidebar
          roomId={id}
          modalHandler={modalHandler}
        />
        <div className="chatroom-wrap">
          <div className="chatroom-message-list-wrap">
            <div className="chatroom-message-list">
              <ChatMessage isSelfMessage={false} nickname="chlee" content="test" />
              {messages.map(message => (
                <ChatMessage key={message.id} isSelfMessage={true} nickname={message.name} content={message.text}/>
              ))}
              <AlwaysScrollToBottom/>
            </div>
            <div className="chatroom-user-input">
              <input 
                className="input-field"
                placeholder="내용을 입력하세요"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyPress={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="button-chatroom-exit"
        onClick={leaveChannel}
      >
        채팅방 나가기
      </div>
      <GameModalListener modalHandler={modalHandler}/>
    </>
  );
}

export default Chatroom;
