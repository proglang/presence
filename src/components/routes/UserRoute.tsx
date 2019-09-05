// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { Route, RouteProps, Redirect as RedirectReact, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux';
import { Error401 } from '../pages/ErrorPage'
import { IReduxRootProps } from '../../rootReducer';
import { TRights, TRight } from '../../api/api.exam.user';
import * as exam from '../../api/api.exam'
import { Loader, Dimmer } from 'semantic-ui-react';


export interface IUserRouteProps {
  req?: TRight;
}
interface IUserRouteState {
  ret: boolean
}
class UserRoute extends React.Component<IUserRouteProps & RouteProps & ReduxProps & RouteComponentProps & ReduxFn, IUserRouteState> {
  state: IUserRouteState = {
    ret: false
  }
  wait = false;
  public render() {
    const { login, access, req } = this.props;
    if (!login) return (<Error401 />);
    const { component, ...props } = this.props;
    if (!this.state.ret) {
      return <Route {...props} render={(data) => {
        const params = data.match.params;
        if (!!params.id && params.id !== this.props.examid) {
          if (!this.wait) {
            this.wait = true;
            if (this.props.examlist[params.id]) {
              // this.props.selectexam(params.id).then(() => this.setState({ ret: true }))
              if (req && (!access || !access[req])) return (<RedirectReact to="/" />)
              return (<Route {...this.props} />);
            } else {
              this.props.loadexam(params.id).then(() => this.setState({ ret: true }))
            }
          }
          return <Dimmer active><Loader /></Dimmer>
        }
        if (req && (!access || !access[req])) return (<RedirectReact to="/" />)
        return (<Route {...this.props} />);
      }
      } />
    }
    if (req && (!access || !access[req])) return (<RedirectReact to="/" />)
    return (<Route {...this.props} />);
  }
}


interface ReduxFn {
  loadexam: any
  selectexam: any;
}
interface ReduxProps {
  login: boolean;
  access: TRights | null
  examid: number | null
  examlist: { [key: number]: exam.IData }
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { user, exams } = state;
  const { selected, ...list } = exams;
  const exam = selected ? list[selected] : null;
  return ({
    login: !!user,
    access: exam ? exam.rights : null,
    examid: exam ? exam.id : null,
    examlist: exams,
    //examid: Object.keys(list).count > 0 ? selected : -1
  })
}
export default withRouter(connect(mapStateToProps, { loadexam: exam.list, selectexam: exam.select })(UserRoute));