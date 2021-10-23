import React from "react";
import * as uuid from 'uuid';
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/header";
import ModalHandler from "../../components/modal/modalhandler";
import ChatMessage from "./message/message";
import { ioChannel } from "../../socket/socket";
import "./channel.scss";
import GameModalListener from "../../components/modal/gameModalListener";
import axios from "axios";
import ChannelSidebar from "../../components/sidebar/channelSidebar";

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

const Channel = () => {
  const modalHandler = ModalHandler();
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [text, setText] = useState('');
  let { id } : any = useParams();

  useEffect(() => {
    const receivedMessage = (message: Payload) => {
      const newMessage: Message = {
        id: uuid.v4(),
        name: message.name,
        text: message.text,
      };
      setMessages([...messages, newMessage]);
    }

    axios
    .post(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/${id}/member`)
    .then() //SUCCESS
    .catch((e) => {
      console.log(`error : `, e.response.data);
      if (e.response.data.statusCode !== 409) { //Conflict Exception : is already join channel
        window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/main `;
        window.alert("비정상적인 접근입니다");
      }
    })

    ioChannel.on('msgToClient', (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, id]);

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || text === '')
			return;
		const newMessageSend = {
      channelId: id,
      text: text,
		};
		ioChannel.emit('msgToChannel', newMessageSend);
		setText('');
	}

  const leaveChannel = async () => {
    await axios.delete(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/${id}/member`);
    window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/main`;
  }

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <ChannelSidebar
          channelId={id}
          modalHandler={modalHandler}
        />
        <div className="channel-wrap">
          <div className="channel-message-list-wrap">
            <div className="channel-message-list">
              <ChatMessage isSelfMessage={false} nickname="chlee" content="test" />
              {messages.map(message => (
                <ChatMessage key={message.id} isSelfMessage={true} nickname={message.name} content={message.text}/>
              ))}
              <AlwaysScrollToBottom/>
            </div>
            <div className="channel-user-input">
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
        className="button-channel-exit"
        onClick={leaveChannel}
      >
        채팅방 나가기
      </div>
      <GameModalListener modalHandler={modalHandler}/>
    </>
  );
}

export default Channel;
