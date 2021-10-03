import * as uuid from 'uuid';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Header from '../../components/header/header';
import SideBar from '../../components/sideBar/sideBar';
import './chatroom.scss';
import ChatMessage from './message/message';
import { ioChannel } from '../../socket/socket';

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
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [text, setText] = useState('');

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
      text
		};
		ioChannel.emit('msgToChannel', newMessageSend);
		setText('');
	}

  return (
    <>
      <Header isLoggedIn={true}/>
      <div className="page">
        <SideBar />
        <div className="chatroom-wrap">
          <div className="chatroom-message-list">
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
          </div>
        </div>
      </div>

      <div className="button-chatroom-exit" onClick={()=>{window.location.href="http://localhost:3000/"}}>채팅방 나가기</div>
    </>

  );
}

export default Chatroom;