import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./channelInviteModal.scss";

enum Result {
  NONE = 0,
  SUCCESS,
  ERROR,
}

type ChannelInviteModalProps = {
  open: boolean;
  close: any;
  channelId: number;
};

const ChannelInviteModal = (prop: ChannelInviteModalProps) => {
  const Title = "채팅방 초대";
  const Description = "친구의 닉네임을 알고 있다면 채팅방에 초대해보세요!";

  const nickPlaceholder = "플레이어 닉네임";
  const buttonTitle = "친구 초대";

  const [nickname, setNickname] = useState("");
  const [resultText, setResultText] = useState("");
  const resultCode = useRef(Result.NONE);

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
    var targetId = 0;
    try {
      const user = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/search/${nickname}`)
      targetId = user.data.id;
    } catch (error) {}
    
    console.log(`targetid : `, targetId);

    axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/${prop.channelId}/invite/${targetId}`)
    .then(() => {
      resultCode.current = Result.SUCCESS;
      setResultText("초대 메시지를 보냈습니다!");
    })
    .catch((err) => {
      console.log(`err.response.data : `, err.response.data)
      resultCode.current = Result.ERROR;
      if (err.response.data.statusCode === 404)
        setResultText("존재하지 않는 플레이어입니다. 다시 시도해주세요.");
      if (err.response.data.statusCode === 400)
        setResultText("자기 자신은 초대할 수 없습니다.");
      if (err.response.data.statusCode === 409) {
        if (err.response.data.message == "Already channel member") {
          setResultText(nickname + " 님은 이미 채팅방에 참여중입니다.");
        }
        else {
          setResultText("이미 초대장을 보냈습니다!");
        }
      }
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
              resultCode.current == Result.NONE
                ? ""
                : resultCode.current == Result.SUCCESS
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

export default ChannelInviteModal;
