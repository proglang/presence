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
        [<LoginForm/>,
        <RegisterForm/>]
    );
  }
}
