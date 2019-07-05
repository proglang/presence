// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import * as ExamUserForms from '../forms/AddUserForms'
import { Container, Tab, TabProps, Segment } from 'semantic-ui-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom'
export interface IExamUserPageProps {
}

// Todo: Add selected pane to state
class ExamUserPage extends React.Component<IExamUserPageProps & RouteComponentProps<any> & InjectedIntlProps, any> {
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
        <Segment placeholder />
      </Container>
    );
  }
}
export default injectIntl(ExamUserPage);