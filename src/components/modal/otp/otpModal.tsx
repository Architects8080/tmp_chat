import React from "react";
import "./otpModal.scss";

type ModalProps = {
  open: any;
  close: any;
};

function OTPModal(prop: ModalProps) {
  const handleClose = () => {
    //redirect to main
    prop.close();
  };

  return (
    <div className={prop.open ? "openModal modal" : "modal"}>
      {prop.open ? (
        <section>
          <div className="otp-modal-wrap">
            <div className="otp-title">OTP 생성기</div>
            <img className="otp-qr" src="https://i.stack.imgur.com/YLy3V.png" alt="cannot showing OTP QR-CODE" />
            <div className="otp-code">QWERTYASDFG</div>
            <pre className="description">
              {`1. Play Store 혹은 App Store에서 Google OTP를 설치하세요.\n2. Google OTP 앱 실행 이후 위 QR코드를 스캔하세요.\n(또는 위 코드 값을 직접 입력하세요.)`}
            </pre>
            <div className="submit-button" onClick={()=>{}}>확인</div>
          </div>
        </section>
      ) : ""}
    </div>
  );
}

export default OTPModal;
