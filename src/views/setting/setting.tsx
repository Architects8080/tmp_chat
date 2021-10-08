import React, { useRef, useState } from "react";
import Header from "../../components/header/header";
import Button from "../../components/button/button";
import ModalHandler from "../../components/modal/modalhandler";
import "./setting.scss";
import OTPModal from "../../components/modal/otp/otpModal";
import axios from "axios";
import snackbar from "../../components/snackbar/snackbar";

function Setting() {
  const modalHandler = ModalHandler();
  const avatarImgInput = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<any>({
    file: "",
    previewURL: "",
  });
  const [otpCode, setOTPCode] = useState<string>("");

  const onImgInputButtonClick = (event: any) => {
    event.preventDefault();

    if (avatarImgInput.current) avatarImgInput.current.click();
  };

  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      var reader = new FileReader();
      var image = e.currentTarget.files[0];
      reader.onloadend = () => {
        console.log(reader.result);
        setAvatar({
          file: image,
          previewURL: reader.result,
        });
      };
      const formData = new FormData();
      formData.append("image", image);
      try {
        await axios
        .post(
          process.env.REACT_APP_SERVER_ADDRESS + "/user/me/avatar",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        reader.readAsDataURL(image);
      } catch (error) {
        snackbar.error("프로필 변경에 실패했습니다.");
      }
    }
  };

  const onOTPRegisterClick = async () => {
    try {
      const res = await axios
      .post(
        process.env.REACT_APP_SERVER_ADDRESS + "/otp/register",
        {},
        { withCredentials: true }
      )
      setOTPCode(res.data);
      modalHandler.handleModalOpen("otp")
    } catch (error) {
      snackbar.error("OTP 설정에 실패했습니다.");
    }
  };

  const onOTPDeregisterClick = async () => {
    try {
      await axios
      .post(
        process.env.REACT_APP_SERVER_ADDRESS + "/otp/deregister",
        {},
        { withCredentials: true }
      )
    } catch (error) {
      snackbar.error("OTP 설정에 실패했습니다.");
    }
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="setting-page">
        <div className="setting-title">환경설정</div>

        <div className="setting-menu">
          <div className="menu-avatar">
            <div className="menu-title">프로필 사진 변경</div>
            <input
              ref={avatarImgInput}
              className="img-input"
              type="file"
              accept="image/*"
              onChange={onImgChange}
            />

            <img
              className="changeButton"
              src={
                avatar.file === ""
                  ? "https://cdn.intra.42.fr/users/chlee.png"
                  : avatar.previewURL
              }
              alt="profile"
              onClick={onImgInputButtonClick}
            />

            <div className="description">
              위 사진을 클릭해 프로필을 변경해보세요.
              <br />
              💡 정방향 사진을 업로드 하는 것을 추천드립니다. 💡
            </div>
          </div>
          <div className="menu-otp">
            <div className="menu-title">2단계 인증 활성화</div>
            {/* TODO user에 맞춰보여주기 */}
            <Button title="활성화 하기" onClick={onOTPRegisterClick} />
            <Button title="비활성화 하기" onClick={onOTPDeregisterClick} />
          </div>
        </div>
      </div>
      {modalHandler.isModalOpen.otp ? (
        <OTPModal
          code={otpCode}
          open={modalHandler.isModalOpen.otp}
          close={() => modalHandler.handleModalClose("otp")}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Setting;
