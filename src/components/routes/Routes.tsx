// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { Error401 } from '../pages/ErrorPage'
import { IReduxRootProps } from '../../rootReducer';
import { TRights, TRight } from '../../api/api.exam.user';

interface ReduxProps {
  login: boolean;
  access: TRights | null
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { user, exams } = state;
  const { selected, ...list } = exams;
  const exam = selected ? list[selected] : null;
  return ({
    login: !!user,
    access: exam ? exam.rights : null
  })
}
export interface IRouteProps {
  RedirectOnError?: string;
}
export interface IPrivateRouteProps {
  req?: TRight;
}

class UserRouteC extends React.Component<IRouteProps & IPrivateRouteProps & RouteProps & ReduxProps> {
  public render() {
    const { login, access, req, RedirectOnError } = this.props;
    if (!login) return RedirectOnError ? <Redirect to={RedirectOnError} /> : <Error401 />;
    if (req && (!access || !access[req])) return RedirectOnError ? <Redirect to={RedirectOnError} /> : <Error401 />;
    return (<Route {...this.props} />);
  }
}
export const User = connect(mapStateToProps)(UserRouteC);

class GuestRouteC extends React.Component<IRouteProps & RouteProps & ReduxProps> {
  public render() {
    const { RedirectOnError, login } = this.props;
    if (!!login) return (<Redirect to={RedirectOnError ? RedirectOnError : "/"} />)
    return (<Route {...this.props} />);
  }
}
export const Guest = connect(mapStateToProps)(GuestRouteC);

class PublicRouteC extends React.Component<RouteProps> {
  public render() {
    return (
      <Route {...this.props} />
    );
  }
}

export const Public = PublicRouteC;