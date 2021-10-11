import React from "react";
import { Route } from "react-router-dom";
import Register from "./views/auth/register/register";
import Main from "./views/main/main";
import "./App.scss";
import Profile from "./views/profile/profile";
import Game from "./views/game/game";
import Setting from "./views/setting/setting";
import OTP from "./views/auth/otp/otp";
import Chatroom from "./views/chatroom/chatroom";
import Login from "./views/auth/login";
import TestLogin from "./views/auth/test";
import { NotificationProvider } from "./components/notification/notificationContext";

function App() {
  return (
    // wip
    <div className="app">
      <NotificationProvider>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/main" component={Main} />
        <Route path="/test" component={TestLogin} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/game/:id" component={Game} />
        <Route path="/setting" component={Setting} />
        <Route path="/otp" component={OTP} />
        <Route path="/register" component={Register} />
        <Route path="/chatroom/:id" component={Chatroom} />
      </NotificationProvider>
    </div>
  );
}

export default App;