import axios from "axios";
import React, { useEffect, useState } from "react";
import RadioButton from "../../../button/radio/radio";
import { roomType } from "../create/chatroomCreateModal";
import "./chatroomSettingModal.scss";

type chatroomSettingModalProps = {
  open: boolean;
  close: any;
  roomId: number;
};

const ChatroomSettingModal = (prop: chatroomSettingModalProps) => {
  const modalTitle = "채팅방 설정";
  const Description = "채팅방 설정을 변경해보세요.";

  const roomPlaceholder = "방 제목";
  const buttonTitle = "변경하기";

  const [title, setTitle] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState(roomType.publicRoom);
  const [password, setPassword] = useState("");

  const [descriptionText, setDescriptionText] = useState(
    "비밀번호는 숫자 4자리로 구성 가능합니다."
  );
  const [errorText, setErrorText] = useState("");

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setDescriptionText("비밀번호는 숫자 4자리로 구성 가능합니다.");
    setErrorText("비밀번호를 적어주세요.");
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

  const handleSubmitEvent = async () => {
    if (title !== '') {
      if (selectedRoomType == roomType.protectedRoom && password.length == 4 || selectedRoomType != roomType.protectedRoom) {
        try {
          await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/update/${prop.roomId}`,
          {
            title,
            type: selectedRoomType,
            password,
          });
          prop.close();
        } catch (e) {
          console.log(e);
          setErrorText("권한이 없습니다");
        }
      }
    }
    if (errorText === "" && title !== '') {

    }
  };

  useEffect(() => {

    console.log(`open?`);
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/${prop.roomId}`)
      .then((channel) => {
        console.log(`channel.data : `, channel.data);
        setTitle(channel.data.title);
        setSelectedRoomType(channel.data.isProtected);
        if (channel.data.isProtected === roomType.protectedRoom)
          setErrorText("비밀번호를 새로 입력해주세요.");
        if (channel.data.isProtected === roomType.privateRoom)
          setErrorText("public를 선택하면 공개방으로 변경됩니다.");
      })
    //io.on(getChatroomSettings)
    // 1. public
    // 2. private
    // 3. protected, password

    // setSelectedRoomType(roomType.publicRoom);
    // setPassword("1243");
  }, []);

  const handleChange = (type: number) => {
    (type == roomType.publicRoom) ? setSelectedRoomType(roomType.publicRoom) :
      (type == roomType.privateRoom) ? setSelectedRoomType(roomType.privateRoom) : setSelectedRoomType(roomType.protectedRoom);
    if (type != roomType.protectedRoom) {
      setErrorText("");
      setPassword("");
    }     
  };

  return (
    <div
      className={prop.open ? "modal-open modal-background" : "modal-background"}
    >
      <div className="chatroom-setting-modal-wrap">
        <div className="modal-header">
          <div className="title">{modalTitle}</div>
          <img
            className="close"
            src="/icons/modal/close.svg"
            onClick={handleClose}
          />
        </div>
        <div className="description">{Description}</div>

        <div className="content">
          <div className="subtitle">방 제목</div>
          {/* value={} onChage={}  */}
          <input
            className="roomTitle"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={roomPlaceholder}
          ></input>
        </div>

        <div className="content">
          <div className="subtitle">구분</div>
          <div className="select">
            <RadioButton
              name="option"
              value={0}
              label="Public"
              isChecked={selectedRoomType === roomType.publicRoom}
              handleChange={handleChange}
            />
            <RadioButton
              name="option"
              value={1}
              label="Private"
              isChecked={selectedRoomType === roomType.privateRoom}
              handleChange={handleChange}
            />
            <RadioButton
              name="option"
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
              <img className="password-icon" src="/icons/modal/password.svg" />
              <input
                className="password-input"
                type="password"
                maxLength={4}
                value={password}
                onChange={handleUserInputChange}
                placeholder={"password"}
              />
            </div>
          </div>
        </div>

        {/* show or not */}
        <div
          className={
            selectedRoomType === roomType.protectedRoom ? "protected-open" : "protected-close"
          }
        >
          <div className="protected-description">{descriptionText}</div>
          <div className="protected-error">{errorText}</div>
        </div>
        <div className={
          selectedRoomType !== roomType.protectedRoom ? "role-error": "protected-close"}>{errorText}</div>

        <div className="submit-wrap">
          <div className="submit" onClick={handleSubmitEvent}>
            <div className="submit-title">{buttonTitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatroomSettingModal;
