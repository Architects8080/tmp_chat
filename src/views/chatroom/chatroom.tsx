import React from "react";
import * as uuid from 'uuid';
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/header";
import ModalHandler from "../../components/modal/modalhandler";
import SideBar from "../../components/sideBar/sideBar";
import { sidebarProperty } from "../../components/sideBar/sideBarType";
import ChatMessage from "./message/message";
import { ioChannel } from "../../socket/socket";

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

    ioChannel.on('msgToClient', (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, text]);

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
  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <SideBar
          title={sidebarProperty.chatMemberList}
          roomId={42}
          modalHandler={modalHandler}
        />
        <div className="chatroom-wrap">
          <div className="chatroom-message-list">
            {messages.map(message => (
              <ChatMessage key={message.id} isSelfMessage={true} nickname={message.name} content={message.text}/>
            ))}
            <ChatMessage isSelfMessage={false} nickname="chlee" content="test" />
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
