import axios from "axios";
import React, { useState } from "react";
import Header from "../../../components/header/header";
import snackbar from "../../../components/snackbar/snackbar";
import "./otp.scss";

function OTP() {
  const [OTP, setOTP] = useState("");

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    const lastCharCode = userInput.charCodeAt(userInput.length - 1);

    if ((lastCharCode >= 48 && lastCharCode <= 57) || e.target.value === "")
      setOTP(userInput);

    if (userInput.length === 6) {
      axios
        .post(
          "http://localhost:5000/otp/login",
          { token: userInput },
          { withCredentials: true }
        )
        .then((res) => {
          window.location.href = "http://localhost:3000/main";
        })
        .catch((err) => {
          snackbar.error("잘못된 코드입니다.");
        });
    }
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="otp-page">
        <div className="otp-title">OTP를 입력하세요.</div>
        <div className="otp-description">
          Google OTP 앱에서 생성된 6자리 코드를 입력하세요.
        </div>
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