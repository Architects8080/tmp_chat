import React, { useRef, useState } from "react";
import Header from "../../components/header/header";
import Button from "../../components/button/button";

import "./setting.scss";

function Setting() {
  const avatarImgInput = useRef<HTMLInputElement>(null);
  const [test, setTest] = useState<any>({
    file: "",
    previewURL: "",
  });

  const onImgInputButtonClick = (event: any) => {
    event.preventDefault();

    if (avatarImgInput.current) avatarImgInput.current.click();
  };

  const onImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.currentTarget.files.item(0).name);
    // var test;
    if (e.currentTarget.files) {
      var reader = new FileReader();
      var image = e.currentTarget.files[0];
      reader.onloadend = () => {
        setTest({
          file: image,
          previewURL: reader.result,
        });
      };
      reader.readAsDataURL(image);
    }

    // if (e.currentTarget.files.item(0))
    // setImageURL(e.currentTarget.files.item(0).name)
    //is add spinner?

    // const formData = new FormData();
    // formData.append('file', e?.target.files[0]);
    // const response = await post ~
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
                test.file === ""
                  ? "https://cdn.intra.42.fr/users/chlee.png"
                  : test.previewURL
              }
              alt="profile"
              onClick={onImgInputButtonClick}
            />

            <div className="description">
              위 사진을 클릭해 프로필을 변경해보세요.
              <br />
              💡 정방향 사진을 업로드 하는 것을 추천드립니다. 💡
            </div>
            {/* <div className="menu-button" onClick={}>test</div> */}
          </div>
          <div className="menu-otp">
            <div className="menu-title">2단계 인증 활성화</div>
            <Button title="활성화 하기" onClick={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Setting;
