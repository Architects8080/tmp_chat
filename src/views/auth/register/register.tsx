import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Header from "../../../components/header/header";
import snackbar from "../../../components/snackbar/snackbar";
import "./register.scss";

function Register() {
  const [form, setForm] = useState({
    nickname: "",
  });

  const [disabled, setDisabled] = useState(false);
  const [isForbiddenError, setForbiddenError] = useState(false);
  const [isRegisted, setRegisted] = useState(false);
  const { nickname } = form;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setDisabled(true);
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await axios
        .post(
          `http://localhost:5000/auth/register`,
          {
            nickname: nickname,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setRegisted(true);
        })
        .catch(error => {
          console.log(`error : `, error.response.data);
          if (error.response.data.statusCode === 403) {
            setForbiddenError(true);
            snackbar.error("잘못된 접근입니다.");
          }
          else if (error.response.data.statusCode === 400) {
            if (error.response.data.message == "TOO LONG NICKNAME")
              snackbar.error("닉네임은 최대 10자까지 가능합니다.");
            else
              snackbar.error("닉네임이 중복되었습니다. 다시 시도해주세요.");
          }
        });
    } catch (error) {};

    setForm({
      nickname: "",
    });
    setDisabled(false);
  };

  //to cleanup function
  useEffect(() => {
    return () => {
      setForbiddenError(false);
      setRegisted(false);
    };
  }, []);

  if (isForbiddenError) return <Redirect to={{ pathname: "/" }} />;
  if (isRegisted) return <Redirect to={{ pathname: "/main" }} />;

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="register">
        <div className="register-title">이름을 알고싶어요.</div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            className="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={handleChange}
            placeholder="닉네임은 무엇인가요?"
          />
          <div className="register-description">
            닉네임은 한번 결정하면 변경할 수 없으니 신중하게 결정해주세요.
          </div>
          <button className="submit" type="submit" disabled={disabled}>
            등록
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
