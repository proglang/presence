import React from 'react';
import * as Route from './components/routes/Routes';
import { Switch } from 'react-router-dom'

import NavBar from './components/navigation/NavBar'
import Footer from './components/footer/Footer';


import LoginPage from './components/pages/LoginPage';
import LogoutPage from './components/pages/LogoutPage';

import ExamPage from './components/pages/ExamPage';
/*
import ExamStudentPage from './components/pages/ExamStudentPage'
import ExamUserPage from './components/pages/ExamUserPage';
import ConfigPage from './components/pages/ConfigPage';
*/
import { Error404 } from "./components/pages/ErrorPage";

import { Container } from 'semantic-ui-react';
import { trace } from './util/debug';
import { getToken } from './util/login';
import { connect } from 'react-redux';
import { user } from './api/api';


export interface IAppProps {
}

export interface IAppState {
  loading: boolean
}

class App extends React.Component<IAppProps & { login: any, login2: any }, IAppState> {
  constructor(props: IAppProps & { login: any, login2: any }) {
    super(props);

    trace("App.tsx", "App()");
    this.state = {
      loading: false
    }
  }

  componentWillMount = () => {
    //| Send Request to Server
    if (getToken() === null) return;
    this.setState({ loading: true })

    this.props.login()
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
    // todo remove!
    //this.props.login2({ email: "test1@test.test", "password": "ABcd1234##" })
    //  .then(() => this.setState({ loading: false }))
    //  .catch(() => this.setState({ loading: false }));

  }

  public render() {
    //active={this.state.loading}
    return (
      <div
        id="App"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
          <NavBar />
          <Container style={{ flex: 1 }}>
            <Switch>
              <Route.Public path="/" exact render={() => null} />
              <Route.Guest path="/login/:type?/:data?" exact component={LoginPage} />
              <Route.Public path="/logout" exact component={LogoutPage} />
              <Route.User path="/exam/list" exact component={ExamPage} />

              <Route.Public component={Error404} />
            </Switch>
          </Container>
          <Footer />
      </div>);
  }
}


/*
        <Route.User path="/exam/user/:type?" exact component={ExamUserPage} />
        <Route.User path="/exam/student/:type?" exact component={ExamStudentPage} />

        <Route.Public path="/config" exact component={ConfigPage} />
*/
export default connect(null, { login: user.token_login, login2: user.login })(App)
