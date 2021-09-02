import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Login from './auth/login';
import Main from './auth/main';
import Register from './auth/register';
import TestLogin from './auth/test';
import Game from './game/modal/game';

function App() {
  return (
	<div>
		<Route exact path="/" component={Login}/>
		<Route path="/test" component={TestLogin}/>
		<Route path="/main" component={Main}/>
		<Route path="/register" component={Register}/>
		<Route path="/game" component={Game}/>
	</div>
  );
}

export default App;
