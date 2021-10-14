import axios from "axios";
import React, { useRef, useState } from "react";
import { ioCommunity } from "../../../../socket/socket";
import "./addFriendModal.scss";

enum Result {
  Default = 0,
  Success,
  NotFoundUser,
  AlreadyFriend,
  Myself,
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
  const [resultCode, setresultCode] = useState<number>(0);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setResultText("");
    }
    setInput(e.target.value);
  };

  const handleClose = () => {
    setInput("");
    setResultText("");
    setresultCode(0);
    prop.close();
  };

  const handleSubmitEvent = async () => {
    if (input == "") {
      setResultText("");
      return;
    }

    try {
      await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/user/search/${input}`,
        { withCredentials: true }
      )
      .then((response) => {
        //io.emit -> nickname send
        ioCommunity.emit("requestToServer", {otherID: response.data.id, isFriendly: true});
        //io.on -> get result code
        ioCommunity.on("friendResponseToClient", (code: number) => {
          //set Result Text
          setresultCode(code);
          if (code == Result.AlreadyFriend)
            setResultText(input + "님과는 이미 친구입니다.");
          else if (code == Result.Success)
            setResultText("친구 신청을 보냈습니다!");
          else if (code == Result.NotFoundUser)
            setResultText("존재하지 않는 플레이어입니다. 다시 시도해주세요.");
          else if (code == Result.Myself)
            setResultText("본인 외의 플레이어를 입력해주세요.");
        });
      })
      .catch (e => {
        if (e.response.data.statusCode === 404)
          setResultText("존재하지 않는 플레이어입니다. 다시 시도해주세요.");
      });
    } catch (e) {
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
          <div
            className={
              resultCode == Result.Default
                ? ""
                : resultCode == Result.Success
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

export default AddFriendModal;
