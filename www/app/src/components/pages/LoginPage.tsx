// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';

import LoginForm from '../forms/LoginForm'
import { Container } from 'semantic-ui-react';
import { setTitle } from '../../util/helper';
import { injectIntl, WrappedComponentProps } from 'react-intl';

export interface ILoginPageProps {
}

export interface ILoginPageState {

}

class LoginPage extends React.Component<ILoginPageProps & WrappedComponentProps, ILoginPageState> {
  componentDidMount = () => {
    setTitle(this.props.intl.formatMessage({ id: "page.login" }))
  }

  public render() {
    return (
      <Container as="main">
        <LoginForm />
      </Container>
    );
  }
}

export default injectIntl(LoginPage)
