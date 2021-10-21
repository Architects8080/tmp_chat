import React from "react";
import "./otpModal.scss";

type ModalProps = {
  code: string;
  open: any;
  close: any;
};

const OTPModal = (prop: ModalProps) => {
  const handleClose = () => {
    prop.close();
  };

  return (
    <div className={prop.open ? "modal-open modal-background" : "modal-background"}>
      {prop.open ? (
        <section>
          <div className="otp-modal-wrap">
            <div className="otp-title">OTP 생성기</div>
            <img
              className="otp-qr"
              src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=otpauth%3A%2F%2Ftotp%2FTranscendance%3Fsecret%3D${prop.code}`}
              alt="cannot showing OTP QR-CODE"
            />
            <div className="otp-code">{prop.code}</div>
            <pre className="description">
              {`1. Play Store 혹은 App Store에서 Google OTP를 설치하세요.\n2. Google OTP 앱 실행 이후 위 QR코드를 스캔하세요.\n(또는 위 코드 값을 직접 입력하세요.)`}
            </pre>
            <div
              className="submit-button"
              onClick={handleClose}
            >
              확인
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </div>
  );
}

export default OTPModal;
