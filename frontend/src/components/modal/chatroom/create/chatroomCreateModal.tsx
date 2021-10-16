<<<<<<< HEAD
import React, { useState } from 'react';
import { useEffect } from 'react';
import { ioChannel } from '../../../../socket/socket';
import RadioButton from '../../../button/radio/radio';
import './chatroomCreateModal.scss';
=======
import React, { useState } from "react";
import { useEffect } from "react";
import { ioChannel } from "../../../../socket/socket";
import RadioButton from "../../../button/radio/radio";
import "./chatroomCreateModal.scss";
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

type chatroomCreateModalProps = {
  open: boolean;
  close: any;
};

type channelCreateDto = {
  title: string;
  type: number;
  password?: string;
}

<<<<<<< HEAD
type channelCreateDto = {
  title: string;
  type: number;
  password?: string;
}

const ChatroomCreateModal = (prop: chatroomCreateModalProps) => {

  const modalTitle = "채팅방 생성";
  const Explain = "채팅방을 만들어 다른 유저와 소통해보세요!";
=======
export enum roomType {
  publicRoom,
  privateRoom,
  protectedRoom
}

const ChatroomCreateModal = (prop: chatroomCreateModalProps) => {
  const modalTitle = "채팅방 생성";
  const Description = "채팅방을 만들어 다른 유저와 소통해보세요!";
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77

  const roomPlaceholder = "방 제목";
  const buttonTitle = "생성하기";

  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");

  const [descriptionText, setDescriptionText] = useState(
    "비밀번호는 숫자 4자리로 구성 가능합니다."
  );
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    ioChannel.on('channelCreated', (channelId) => {
      window.location.href = `http://localhost:3000/chatroom/${channelId}`
    });
  }, []);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setDescriptionText("비밀번호는 숫자 4자리로 구성 가능합니다.");
    if (e.target.value.length !== 4)
      setErrorText("비밀번호를 숫자 4자리로 구성해주세요.");
    else if (
      isNaN(Number(e.target.value)) ||
      Number(e.target.value) < 0 ||
      Number(e.target.value) > 9999
    )
      setErrorText("비밀번호에는 숫자만 입력 가능합니다.");
    else {
      setErrorText("");
      setDescriptionText("");
    }
  };

  const handleClose = () => {
    setPassword("");
    prop.close();
  };

  const handleSubmitEvent = () => {
<<<<<<< HEAD
    if (errorText === "") {
=======
    if (errorText === "" && title !== '') {
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
      const newChannel: channelCreateDto = {
        title: title,
        type: selectedRoomType,
        password: password,
      }
<<<<<<< HEAD
      ioChannel.emit('createChannel', newChannel); 
=======
      ioChannel.emit('createChannel', newChannel);
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
      prop.close();
    }
  };

<<<<<<< HEAD
  const [selectedRoomType, setSelectedRoomType] = useState(0);

  const handleChange = (inputValue: string) => {
    (inputValue === 'option-0') ? setSelectedRoomType(0) :
      (inputValue === 'option-1') ? setSelectedRoomType(1) : setSelectedRoomType(2);
=======
  const [selectedRoomType, setSelectedRoomType] = useState(roomType.publicRoom);

  const handleChange = (type: number) => {
    (type == roomType.publicRoom) ? setSelectedRoomType(roomType.publicRoom) :
      (type == roomType.privateRoom) ? setSelectedRoomType(roomType.privateRoom) : setSelectedRoomType(roomType.protectedRoom);
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
  };

  return (
    <div
      className={prop.open ? "modal-open modal-background" : "modal-background"}
    >
      <div className="chatroom-create-modal-wrap">
        <div className="modal-header">
          <div className="title">{modalTitle}</div>
<<<<<<< HEAD
          <img className="close" alt="close" src="/icons/modal/close.svg" onClick={handleClose}/>
=======
          <img
            className="close"
            alt="close"
            src="/icons/modal/close.svg"
            onClick={handleClose}
          />
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
        </div>
        <div className="description">{Description}</div>

        <div className="content">
          <div className="subtitle">방 제목</div>
<<<<<<< HEAD
          <input 
            className="room-title" 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder={roomPlaceholder}></input>
=======
          {/* value={} onChage={}  */}
          <input
            className="room-title"
            type="text"
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder={roomPlaceholder}
          ></input>
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
        </div>

        <div className="content">
          <div className="subtitle">구분</div>
          <div className="select">
            <RadioButton
              name="option"
<<<<<<< HEAD
              value="option-0"
              label="Public"
              isChecked={selectedRoomType === 0}
=======
              value={0}
              label="Public"
              isChecked={selectedRoomType === roomType.publicRoom}
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
              handleChange={handleChange}
            />
            <RadioButton
              name="option"
<<<<<<< HEAD
              value="option-1"
              label="Private"
              isChecked={selectedRoomType === 1}
=======
              value={1}
              label="Private"
              isChecked={selectedRoomType === roomType.privateRoom}
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
              handleChange={handleChange}
            />
            <RadioButton
              name="option"
<<<<<<< HEAD
              value="option-2"
              label="Protected"
              isChecked={selectedRoomType === 2}
              handleChange={handleChange}
            />
            <div className={selectedRoomType === 2 ? "password-open" : "password-close"}>
              <img className="password-icon" alt="password-icon" src="/icons/modal/password.svg"/>
              <input className="password-input" type="password" maxLength={4} value={password} onChange={handleUserInputChange} placeholder={"password"}/>
=======
              value={2}
              label="Protected"
              isChecked={selectedRoomType === roomType.protectedRoom}
              handleChange={handleChange}
            />
            <div
              className={
                selectedRoomType === roomType.protectedRoom
                  ? "password-open"
                  : "password-close"
              }
            >
              <img
                className="password-icon"
                alt="password-icon"
                src="/icons/modal/password.svg"
              />
              <input
                className="password-input"
                type="password"
                maxLength={4}
                value={password}
                onChange={handleUserInputChange}
                placeholder={"password"}
              />
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
            </div>
          </div>
        </div>

        {/* show or not */}
<<<<<<< HEAD
        <div className={selectedRoomType === 2 ? "protected-open" : "protected-close"}>
          <div className="protected-explain">{explainText}</div>
=======
        <div
          className={
            selectedRoomType === 2 ? "protected-open" : "protected-close"
          }
        >
          <div className="protected-description">{descriptionText}</div>
>>>>>>> 7ea3303af2888e238a68985385c8fe3e26348f77
          <div className="protected-error">{errorText}</div>
        </div>

        <div className="submit-wrap">
          <div className="submit" onClick={handleSubmitEvent}>
            <div className="submit-title">{buttonTitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatroomCreateModal;
