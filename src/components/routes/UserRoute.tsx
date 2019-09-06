// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { Route, RouteProps, /*Redirect as RedirectReact,*/ withRouter, RouteComponentProps } from 'react-router-dom'
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
  loading: boolean
  loaded: boolean
}
type TProps = IUserRouteProps & RouteProps & ReduxProps & RouteComponentProps & ReduxFn
class UserRoute extends React.Component<TProps, IUserRouteState> {
  state: IUserRouteState = {
    loading: false,
    loaded: false,
  }
  componentDidUpdate = (props: TProps) => {
    const { login } = this.props;
    const { loading, loaded } = this.state;
    if (!login) return;


    //@ts-ignore
    const id = this.props.computedMatch.params.id
    if (id === this.props.examid) return;
    if (loaded) return //this.setState({ loaded: false })
    if (loading) return;

    if (this.props.examlist[id] && !loading) {
      this.setState({ loading: true })
      this.props.loadexam(id).then(() => this.setState({ loading: false, loaded: true }))
    }
  }
  public render() {
    const { login, access, req } = this.props;
    if (!login) return (<Error401 />);
    if (this.state.loading) {
      return <Dimmer active><Loader /></Dimmer>
    }
    if (req && (!access || !access[req])) return (<Error401 />)
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