import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./chatroomInviteModal.scss";

enum Result {
  None = 0,
  Success,
  NotFoundUser,
  AlreadyJoined,
}

type chatroomInviteModalProps = {
  open: boolean;
  close: any;
  roomId: number;
};

function ChatroomInviteModal(prop: chatroomInviteModalProps) {
  const Title = "채팅방 초대";
  const Description = "친구의 닉네임을 알고 있다면 채팅방에 초대해보세요!";

  const nickPlaceholder = "플레이어 닉네임";
  const buttonTitle = "친구 초대";

  const [nickname, setNickname] = useState("");
  const [resultText, setResultText] = useState("");
  const resultCode = useRef(Result.None);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setResultText("");
      resultCode.current = 0;
    }
    setNickname(e.target.value);
  };

  const handleClose = () => {
    setNickname("");
    setResultText("");
    prop.close();
  };

  const handleSubmitEvent = async () => {
    //axios.get(user/nickname), -> then axios.get(channelmember, check) -> then.
    //io.emit -> nickname & roomId send
    //io.on -> get result code
    const user = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/me`);
    console.log(`user.data.id : `, user.data);
    axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/invite/${prop.roomId}`,
      {
        userId: user.data.id,
        nickname: nickname,
      }
    )
    .then((response) => {
      console.log(`response.data : `, response.data);
      resultCode.current = response.data;
      if (response.data == Result.AlreadyJoined)
        setResultText(nickname + " 님은 이미 채팅방에 참여중입니다.");
      else if (response.data == Result.Success)
        setResultText("초대 메시지를 보냈습니다!");
      else if (response.data == Result.NotFoundUser)
        setResultText("존재하지 않는 플레이어입니다. 다시 시도해주세요.");
    })
  };

  return (
    <div
      className={prop.open ? "modal-open modal-background" : "modal-background"}
    >
      <div className="modal-wrap">
        <div className="modal-header">
          <div className="title">{Title}</div>
          <img
            className="close"
            src="/icons/modal/close.svg"
            onClick={handleClose}
          />
        </div>
        <div className="description">{Description}</div>
        <div className="search">
          <div className="search-bar">
            <img className="search-icon" src="/icons/searchbar/search.svg" />
            <input
              className="search-nickname"
              type="text"
              value={nickname}
              onChange={handleUserInputChange}
              placeholder={nickPlaceholder}
            />
          </div>
          <div className="submit" onClick={handleSubmitEvent}>
            <div className="submit-title">{buttonTitle}</div>
          </div>
        </div>
        <div className="result">
          <div
            className={
              resultCode.current == Result.None
                ? ""
                : resultCode.current == Result.Success
                ? "success"
                : "error"
            }
          >
            {resultText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatroomInviteModal;
