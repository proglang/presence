// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { Route, RouteProps, Redirect as RedirectReact } from 'react-router-dom'
import { connect } from 'react-redux';
import { IReduxRootProps } from '../../rootReducer';

interface ReduxProps {
  login: boolean;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { user } = state;
  return ({
    login: !!user,
  })
}
class GuestRoute extends React.Component<RouteProps & ReduxProps> {
  public render() {
    if (!!this.props.login) return (<RedirectReact to="/" />)
    return (<Route {...this.props} />);
  }
}
export default connect(mapStateToProps)(GuestRoute);
