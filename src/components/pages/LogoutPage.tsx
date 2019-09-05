// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import * as React from 'react';
import { connect } from 'react-redux';
import * as user from '../../api/api.user';
import { Redirect } from 'react-router';


export interface ILogoutPageProps {
}

export interface ILogoutPageState {
}

class LogoutPageC extends React.Component<ILogoutPageProps & { logout: any }, ILogoutPageState> {
  constructor(props: ILogoutPageProps & { logout: any }) {
    super(props);
    this.state = {
    }
  }
  componentDidMount = () => {
    //| Send Request to Server
    this.props.logout()
  }
  public render() {
    return (<Redirect to="/" />
    );
  }
}
export default connect(null, { logout: user.logout })(LogoutPageC)