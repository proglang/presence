// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import * as ExamUserForms from '../forms/AddUserForms'
import { Container, Tab, Segment } from 'semantic-ui-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
export interface IExamUserPageProps {
}

class ExamUserPage extends React.Component<IExamUserPageProps & InjectedIntlProps, any> {
  
  public render() {
    const panes = [
        //! Attached false: Workaround for https://github.com/Semantic-Org/Semantic-UI-React/issues/3412
        //! key in pane needed: Workaround for React Warning
        { key: 'userlist', menuItem: this.props.intl.formatMessage({ id: 'user.list.label' }), pane: null },
        { key: 'userlist_add1', menuItem: this.props.intl.formatMessage({ id: 'user.list.add.label' }), pane: <Tab.Pane key="3" attached={false}><ExamUserForms.AddUserListForm /></Tab.Pane> },
        { key: 'userlist_add2', menuItem: this.props.intl.formatMessage({ id: 'user.list.add2.label' }), pane: <Tab.Pane key="4" attached={false}><ExamUserForms.AddUserForm /></Tab.Pane> },
    ]
    return (
        <Container as="main">
            <Tab
                defaultActiveIndex={0}
                renderActiveOnly={false}
                menu={{ attached: false, secondary: true, pointing: true }}
                panes={panes}
            />
            <Segment placeholder />
        </Container>
    );
  }
}
export default injectIntl(ExamUserPage);