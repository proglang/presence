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
import LogoutPage from './components/pages/LogoutPage';
import ExamUserPage from './components/pages/ExamUserPage';
import ConfigPage from './components/pages/ConfigPage';
import { Error404 } from "./components/pages/ErrorPage";
import { Container } from 'semantic-ui-react';

//Todo: Show UserName
function App() {
  //Todo: Create css classes
  return (<div id="App" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <NavBar />
    <Container style={{flex: 1}}>
      <Switch>
        <Route.Public path="/" exact render={() => null} />
        <Route.Guest path="/login/:type?/:data?" exact component={LoginPage} />
        <Route.Public path="/logout" exact component={LogoutPage} />
        <Route.User path="/exam/user/:type?" exact component={ExamUserPage} />
        <Route.Public path="/config" exact component={ConfigPage} />
        <Route.Public component={Error404} />
      </Switch>
    </Container>
    <Footer />
  </div>);
}

export default App;
