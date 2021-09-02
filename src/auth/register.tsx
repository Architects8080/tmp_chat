import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";

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
          console.log("registered!");
          setRegisted(true);
        });
    } catch (error) {
      //forbidden (already existed user)
      console.log("error! redirect to main.");
      setForbiddenError(true);
    }
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
    <div>
      <form onSubmit={handleSubmit}>
        <input name="nickname" value={nickname} onChange={handleChange} />
        <button type="submit" disabled={disabled}>
          등록
        </button>
      </form>
    </div>
  );
}

export default Register;
