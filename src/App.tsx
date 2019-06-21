// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import * as Route from './components/routes/Routes';
import { Switch } from 'react-router-dom'

import NavBar from './components/navigation/NavBar'

import LoginPage from './components/pages/LoginPage';
import { Error404 } from "./components/pages/ErrorPage";


function App() {
  return (<div id="App" style={{height:"100%"}}>
  <NavBar/>
  <Switch>
    <Route.Public path="/login/:type?/:data?" exact component={LoginPage} />
    <Route.Public component={Error404} />
  </Switch>
  <footer style={{position:"absolute", bottom: 0, width: "100%", backgroundColor: "black", color: "white", minHeight: "2em", textAlign: "center"}}>Footer</footer>
</div>);
}

export default App;
