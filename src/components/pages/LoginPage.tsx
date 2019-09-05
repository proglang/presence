// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';

import LoginForm from '../forms/LoginForm'
import { Container } from 'semantic-ui-react';
import { setTitle } from '../../util/helper';

export interface ILoginPageProps {
}

export interface ILoginPageState {

}

export default class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
  constructor(props: ILoginPageProps) {
    super(props);

    this.state = {

    }
  }
  componentDidMount = () => {
    setTitle("__login__") // Todo: Loca
  }

  public render() {
    return (
      <Container as="main">
        <LoginForm/>
      </Container>
    );
  }
}
