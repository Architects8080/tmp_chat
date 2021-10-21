import React, { useEffect } from "react";

const TestLogin = () => {

  useEffect(() => {
    window.location.href = `${process.env.REACT_APP_SERVER_ADDRESS}/auth/test`;
  }, []);

  return <></>;
}

export default TestLogin;
