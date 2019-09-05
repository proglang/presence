// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import PublicRoute from './components/routes/PublicRoute';
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
import { Error404, ErrorConfig } from "./components/pages/ErrorPage";

import { Container, Modal, Button, Icon } from 'semantic-ui-react';
import { trace } from './util/debug';
import { getToken } from './util/login';
import { connect } from 'react-redux';
import * as user from './api/api.user';
import * as error from './api/api.error';

import ExamUserPage from './components/pages/ExamUserPage';
import ExamStudentPage from './components/pages/ExamStudentPage';
import ExamLogPage from './components/pages/ExamLogPage';
import UserPage from './components/pages/UserPage';
import { checkConfig } from './util/settings';
import Redirect from './components/routes/Redirect';
import GuestRoute from './components/routes/GuestRoute';
import UserRoute from './components/routes/UserRoute';

import { IReduxRootProps } from './rootReducer';
import { TError } from './reducer/error';
import { FormattedMessage } from 'react-intl';


export interface IAppProps {
}

export interface IAppState {
  loading: boolean
}

class App extends React.Component<IAppProps & ReduxProps & ReduxFn, IAppState> {
  constructor(props: IAppProps & ReduxProps & ReduxFn) {
    super(props);

    trace("App.tsx", "App()");
    this.state = {
      loading: false
    }
  }

  componentDidMount = () => {
    //| Send Request to Server
    if (getToken() === null) return;
    this.setState({ loading: true })

    this.props.login()
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  public render() {
    //active={this.state.loading}
    const { error } = this.props
    if (!checkConfig()) {
      return <div
        id="App"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Container style={{ flex: 1 }}>
          <PublicRoute component={ErrorConfig} />
        </Container>

      </div>

    }
    return (
      <div
        id="App"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavBar />
        <Container style={{ flex: 1 }}>
          <Modal basic open={!!error} onClose={() => this.props.closeError()} >
            <Modal.Content>
              {error && <FormattedMessage id={error} />}
            </Modal.Content>
            <Modal.Actions>
              <Button basic color='red' inverted onClick={() => this.props.closeError()}>
                <Icon name='remove' /> No
            </Button>
            </Modal.Actions>
          </Modal>
          <Switch>
            <Redirect path="/" exact auth="/exam/list" default="/login" />

            <GuestRoute path="/login" exact component={LoginPage} />
            <PublicRoute path="/logout" exact component={LogoutPage} />
            <UserRoute path="/exam/list/:new?" exact component={ExamPage} />
            <UserRoute path="/user" exact component={UserPage} />
            <UserRoute req="exam_viewuser" path="/exam/:id/user/:new?" exact component={ExamUserPage} />
            <UserRoute req="exam_viewstudent" path="/exam/:id/student/:new?" exact component={ExamStudentPage} />
            <UserRoute req="exam_viewlog" path="/exam/:id/log/:new?" exact component={ExamLogPage} />

            <PublicRoute component={Error404} />
          </Switch>
        </Container>
        <Footer />
      </div>);
  }
}

interface ReduxFn {
  login: any;
  login2: any;
  closeError: any;
}

interface ReduxProps {
  error: TError;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  return ({
    error: state.error
  })
}
export default connect(mapStateToProps, { login: user.token_login, login2: user.login, closeError: error.set })(App)
