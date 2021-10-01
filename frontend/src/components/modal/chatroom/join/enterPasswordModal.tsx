import React, { useState } from 'react';
import './enterPasswordModal.scss';

type enterPasswordModalProps = {
  open: boolean;
  close: any;
}

function EnterPasswordModal(prop: enterPasswordModalProps) {
  const Title = "채팅방 접속";
  const Explain = "비밀번호를 입력해주세요.";

  const nickPlaceholder = "password";
  const buttonTitle = "접속";

  const [input, setInput] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "")
      setErrorText("");
    setInput(e.target.value);
  }

  const handleClose = () => {
    setInput("");
    prop.close();
  }

  const handleSubmitEvent = () => {
    console.log(`userInput : `, input);

    //io.emit -> password send
    //code

    //io.on -> get result code & setErrorext
    if (input === "4242") {
      //io.emit(connect)
      setErrorText("🎉🎉");
      prop.close();
    }
    else
      setErrorText("비밀번호가 틀렸습니다.");

  }
  return (
    <div className={prop.open ? "modal-open modal-background" : "modal-background"}>
      <div className="modal-wrap">
        <div className="modal-header">
          <div className="title">{Title}</div>
          <img className="close" alt="close" src="/icons/modal/close.svg" onClick={handleClose}/>
        </div>
        <div className="explain">{Explain}</div>
        <div className="search">
          <div className="search-bar">
            <img className="search-icon" alt="search-icon" src="/icons/modal/password.svg"/>
            <input className="search-nickname" type="password" maxLength={4} value={input} onChange={handleUserInputChange} placeholder={nickPlaceholder}/>
          </div>
          <div className="submit" onClick={handleSubmitEvent}>
            <div className="submit-title">{buttonTitle}</div>
          </div>
        </div>
        <div className="result">
          <div className={errorText === "" ? "" : "error"}>{errorText}</div>
        </div>
      </div>
    </div>
  );
}

export default EnterPasswordModal;
