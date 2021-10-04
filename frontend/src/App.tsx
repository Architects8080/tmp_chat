import React from 'react';
import { Route } from 'react-router-dom';
import Register from './views/auth/register/register';
import Main from './views/main/main';
import './App.scss';
import Profile from './views/profile/profile';
import Game from './views/game/game';
import Setting from './views/setting/setting';
import OTP from './views/auth/otp/otp';
import Chatroom from './views/chatroom/chatroom';

function App() {
  return (
    // wip
    <div className="app">
      <Route exact path="/" component={Main}/>
      <Route path="/main" component={Main}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/game/:id" component={Game} />
      <Route path="/setting" component={Setting}/>
      <Route path="/otp" component={OTP}/>
      <Route path="/register" component={Register}/>
      <Route exact path="/chatroom/:id" component={Chatroom}/>
    </div>
  );
}

export default App;
