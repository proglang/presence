// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { RouteProps, Redirect as RedirectReact } from 'react-router-dom'
import { connect } from 'react-redux';
import { IReduxRootProps } from '../../rootReducer';

interface ReduxProps {
  login: boolean;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { user} = state;
  return ({
    login: !!user,
  })
}

export interface IRouteRedirectCProps {
  auth: string;
  default: string;
}

class RouteRedirectC extends React.Component<IRouteRedirectCProps & RouteProps & ReduxProps> {
  public render() {
    const { login, auth, default: def } = this.props;
    if (!!login) return (<RedirectReact to={auth} />)
    return (<RedirectReact to={def} />)
  }
}
export default connect(mapStateToProps)(RouteRedirectC);
