import React, { useEffect } from "react";

function Login() {
  const clientID = process.env.REACT_APP_42_CLIENT_ID;
  const callbackURL = process.env.REACT_APP_42_CALLBACK;
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${callbackURL}&response_type=code`;

  useEffect(() => {
    window.location.href = url;
  }, []);

  return <></>;
}

export default Login;
