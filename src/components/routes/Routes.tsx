// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import {  Route, RouteProps, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import {Error401} from '../pages/ErrorPage'

interface ReduxProps {
  login: boolean;
  access: {[key:string]:boolean}
}
const mapStateToProps = (state: any): ReduxProps => {
  return ({
    login: !!state.user,
    access: {}
  })
}
export interface IPrivateRouteProps {

}

class UserRouteC extends React.Component<IPrivateRouteProps & RouteProps & ReduxProps> {
  public render() {
  if (!this.props.login) return (<Error401/>);
      // Todo: Protect Route
    return (<Route {...this.props}/>);
  }
}
export const User = connect(mapStateToProps)(UserRouteC);

class GuestRouteC extends React.Component<RouteProps & ReduxProps> {
  public render() {
    if (!!this.props.login) return (<Redirect to="/"/>)
    return (<Route {...this.props}/>);
  }
}
export const Guest = connect(mapStateToProps)(GuestRouteC);

class PublicRouteC extends React.Component<RouteProps> {
  public render() {
    return (
      <Route {...this.props}/>
    );
  }
}

export const Public = PublicRouteC;