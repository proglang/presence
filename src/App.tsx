// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import * as Route from './components/routes/Routes';
import { Switch } from 'react-router-dom'

import NavBar from './components/navigation/NavBar'
import Footer from './components/footer/Footer';

import LoginPage from './components/pages/LoginPage';
import ConfigPage from './components/pages/ConfigPage';
import { Error404 } from "./components/pages/ErrorPage";


function App() {
  return (<div id="App" style={{height:"100%"}}>
  <NavBar/>
  <Switch>
    <Route.Public path="/" exact render={()=>null} />
    <Route.Public path="/login/:type?/:data?" exact component={LoginPage} />
    <Route.Public path="/config" exact component={ConfigPage} />
    <Route.Public component={Error404} />
  </Switch>
  <Footer/>
</div>);
}

export default App;
