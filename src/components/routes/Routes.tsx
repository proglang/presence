// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import {  Route, RouteProps } from 'react-router-dom'

export interface IPrivateRouteProps {

}
export class User extends React.Component<IPrivateRouteProps & RouteProps> {
  public render() {
      // Todo: Protect Route
    return (<Route {...this.props}/>);
  }
}

export class Guest extends React.Component<RouteProps> {
  public render() {
    // Todo: Protect Route
    return (<Route {...this.props}/>);
  }
}

export class Public extends React.Component<RouteProps> {
  public render() {
    return (
      <Route {...this.props}/>
    );
  }
}
