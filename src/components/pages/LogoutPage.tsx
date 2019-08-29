// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import * as React from 'react';
import { connect } from 'react-redux';
import * as user from '../../api/api.user';


export interface ILogoutPageProps {
}

export interface ILogoutPageState {
}

class LogoutPageC extends React.Component<ILogoutPageProps & {logout: any}, ILogoutPageState> {
  constructor(props: ILogoutPageProps & {logout: any}) {
    super(props);
    this.state = {
    }
  }
  componentDidMount = () => {
    //| Send Request to Server
    this.props.logout()
    // Todo: Error Handling
  }
  public render() {
      //Todo: Loca
      //Todo: Actual logout page
    return (
      <div>
        <h1>Fancy Logout Page</h1>
      </div>
    );
  }
}
export default connect(null, {logout: user.logout})(LogoutPageC)