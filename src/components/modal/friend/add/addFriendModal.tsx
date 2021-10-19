import axios from "axios";
import React, { useState } from "react";
import "./addFriendModal.scss";

enum Result {
  NotFoundUser = "NotFoundUser",
  Already = "Already",
  Myself = "Myself",
  InProgress = "InProgress",
  Block = "Block",
}

type addFriendModalProps = {
  open: boolean;
  close: any;
};

function AddFriendModal(prop: addFriendModalProps) {
  const Title = "친구 추가";
  const Description = "친구의 닉네임을 알고 있다면 친구 요청을 보내보세요!";

  const nickPlaceholder = "플레이어 닉네임";
  const buttonTitle = "친구 추가";

  const [input, setInput] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const resultToText = (result: Result) => {
    switch (result) {
      case Result.NotFoundUser:
        return "존재하지 않는 플레이어입니다. 다시 시도해주세요.";
      case Result.Already:
        return `${input}님과는 이미 친구입니다.`;
      case Result.Myself:
        return "본인 외의 플레이어를 입력해주세요.";
      case Result.InProgress:
        return "이미 친구 요청을 보냈습니다.";
      case Result.Block:
        return "차단한 플레이어입니다. 차단을 해제한 후 다시 시도해주세요.";
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setResultText("");
      setIsSuccess(false);
    }
    setInput(e.target.value);
  };

  const handleClose = () => {
    setInput("");
    setResultText("");
    setIsSuccess(false);
    prop.close();
  };

  const handleSubmitEvent = async () => {
    if (input == "") {
      setResultText("");
      return;
    }

    try {
      const user = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/user/search/${input}`
      );
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_ADDRESS}/friend/${user.data.id}`
      );
      setResultText("친구 신청을 보냈습니다!");
      setIsSuccess(true);
    } catch (e: any) {
      if (e.response.status == 404)
        setResultText("존재하지 않는 플레이어입니다. 다시 시도해주세요.");
      else if (e.response.status == 400) {
        setResultText(resultToText(e.response.data.message));
      }
      setIsSuccess(false);
      console.log(`[addFriendModal] ${e}`);
    }
    setInput("");
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
              value={input}
              onChange={handleUserInputChange}
              placeholder={nickPlaceholder}
            />
          </div>
          <div className="submit" onClick={handleSubmitEvent}>
            <div className="submit-title">{buttonTitle}</div>
          </div>
        </div>
        <div className="result">
          <div className={isSuccess ? "success" : "error"}>{resultText}</div>
        </div>
      </div>
    </div>
  );
}

export default AddFriendModal;
