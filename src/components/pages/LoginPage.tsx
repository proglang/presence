// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';

import LoginForm from '../forms/LoginForm'
import RegisterForm from '../forms/RegisterForm'

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

  public render() {
    return (
        [<LoginForm key="1"/>,
        <RegisterForm key="2"/>]
    );
  }
}
