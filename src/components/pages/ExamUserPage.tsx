// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import * as ExamUserForms from '../forms/AddUserForms'
import { Container, Tab, TabProps, Button } from 'semantic-ui-react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom'
import FilterTable from "../util/FilterTable";
import { connect } from 'react-redux';
import {IExamUserData} from '../../api/examUserData';
export interface IExamUserPageProps {
}

class ExamUserPage extends React.Component<IExamUserPageProps & RouteComponentProps<any> & InjectedIntlProps & ReduxProps, any> {
  onTabChange = (event: any, data: TabProps) => {
    if (!data.panes || typeof (data.activeIndex) !== 'number') return;
    const path = this.props.match.path
    const basepath = path.substr(0, path.indexOf('/:'))
    if (data.activeIndex === 0)
      return this.props.history.push(basepath)
    const pane: any = data.panes[data.activeIndex]
    this.props.history.push(basepath + "/" + pane.key);
  }
  public render() {
    const { type/*, data*/ } = this.props.match.params;
    const panes = [
      //! Attached false: Workaround for https://github.com/Semantic-Org/Semantic-UI-React/issues/3412
      //! key in pane needed: Workaround for React Warning
      { key: 'list', menuItem: this.props.intl.formatMessage({ id: 'user.list.label' }), pane: null },
      { key: 'add1', menuItem: this.props.intl.formatMessage({ id: 'user.list.add.label' }), pane: <Tab.Pane key="3" attached={false}><ExamUserForms.AddUserListForm /></Tab.Pane> },
      { key: 'add2', menuItem: this.props.intl.formatMessage({ id: 'user.list.add2.label' }), pane: <Tab.Pane key="4" attached={false}><ExamUserForms.AddUserForm /></Tab.Pane> },
    ]
    var index = panes.findIndex((el) => el.key === type)
    index = index >= 0 ? index : 0
    return (
      <Container as="main">
        <Tab
          onTabChange={this.onTabChange}
          activeIndex={index}
          renderActiveOnly={false}
          defaultActiveIndex={0}
          menu={{ attached: false, secondary: true, pointing: true }}
          panes={panes}
        />
        <FilterTable header={[<FormattedMessage id="__LOCA__ NAME"/>,<FormattedMessage id="__LOCA__ EMAIL"/>, ""]} data={this.props.eu} filter={{0:true, 1:true}}/>
      </Container>
    );
  }
}

interface ReduxProps {
  eu:any[][]
}
const mapStateToProps = (state: {eu: IExamUserData[]}):ReduxProps => {
  const data = state.eu.map((value:IExamUserData):any[]=>[value.name, value.email, <Button><FormattedMessage id="btn1"/></Button>, value.note])
  return ({
    eu: data
  })
}
export default connect(mapStateToProps)(injectIntl(ExamUserPage))