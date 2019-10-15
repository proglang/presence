// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { Route, RouteProps } from 'react-router-dom'

export default class PublicRoute extends React.Component<RouteProps> {
  public render() {
    return (
      <Route {...this.props} />
    );
  }
}
