import React, { useState } from "react";
import Header from "../../../components/header/header";
import "./otp.scss";

function OTP() {
  const [OTP, setOTP] = useState("");

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    const lastCharCode = userInput.charCodeAt(userInput.length - 1);

    if ((lastCharCode >= 48 && lastCharCode <= 57) || e.target.value === "")
      setOTP(userInput);

    if (userInput.length === 6) {
      console.log("io.emit otp: ", userInput);

      //io.on get result
      if (userInput === "123123") {
        console.log("accepted!");
        //redirect to main
      } else {
        console.log("rejected!");
        //snackbar error
      }
    }
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="otp-page">
        <div className="otp-title">OTP를 입력하세요.</div>
        <div className="otp-description">Google OTP 앱에서 생성된 6자리 코드를 입력하세요.</div>
        <input
          className="otp-input"
          type="text"
          value={OTP}
          maxLength={6}
          onChange={handleUserInputChange}
        />
      </div>
    </>
  );
}

export default OTP;
