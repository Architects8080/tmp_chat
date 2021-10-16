<<<<<<< HEAD
import * as uuid from 'uuid';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Header from '../../components/header/header';
import SideBar from '../../components/sideBar/sideBar';
import './chatroom.scss';
import ChatMessage from './message/message';
import { ioChannel } from '../../socket/socket';
import { useParams } from 'react-router-dom';
=======
import React from "react";
import * as uuid from 'uuid';
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/header";
import ModalHandler from "../../components/modal/modalhandler";
import SideBar from "../../components/sideBar/sideBar";
import { sidebarProperty } from "../../components/sideBar/sideBarType";
import ChatMessage from "./message/message";
import { ioChannel } from "../../socket/socket";
import "./chatroom.scss";
import GameModalListener from "../../components/modal/gameModalListener";
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

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

<<<<<<< HEAD
const Chatroom = () => {
=======
const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef} />;
};

const Chatroom = () => {
  const modalHandler = ModalHandler();
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
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
<<<<<<< HEAD

      setMessages([...messages, newMessage]);
    }

    ioChannel.on('msgToClient', (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, text]);
=======
      setMessages([...messages, newMessage]);
    }
    ioChannel.emit("joinChannel", id);
    ioChannel.on("joinRefused", () => {
      window.location.href = "http://localhost:3000/main";
      window.alert("비정상적인 접근입니다");
    });
    ioChannel.on('msgToClient', (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, id]);
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

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
<<<<<<< HEAD
=======

  const leaveChannel = () => {
    ioChannel.emit("leaveChannel", id);
    window.location.href = "http://localhost:3000/main";
  }
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <SideBar
          title={sidebarProperty.chatMemberList}
          roomId={id}
          modalHandler={modalHandler}
        />
        <div className="chatroom-wrap">
          <div className="chatroom-message-list">
<<<<<<< HEAD
            {messages.map(message => (
              <ChatMessage key={message.id} isSelfMessage={true} nickname={message.name} content={message.text}/>
            ))}
            {/* <ChatMessage isSelfMessage={false} nickname="chlee" content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."/> */}
            <div className="chatroom-user-input">
              <input 
                className="input-field"
                placeholder="내용을 입력하세요"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyPress={sendMessage}
              />
            </div>
=======
            <ChatMessage isSelfMessage={false} nickname="chlee" content="test" />
            {messages.map(message => (
              <ChatMessage key={message.id} isSelfMessage={true} nickname={message.name} content={message.text}/>
            ))}
          </div>
          <div className="chatroom-user-input">
            <input 
              className="input-field"
              placeholder="내용을 입력하세요"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={sendMessage}
            />
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
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
