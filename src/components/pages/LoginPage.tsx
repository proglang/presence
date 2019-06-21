// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { Tab, TabProps } from 'semantic-ui-react'
import { injectIntl, InjectedIntlProps } from 'react-intl';

import LoginForm from '../forms/LoginForm'
import LoginTokenForm from '../forms/TokenLoginForm'
import RegisterForm from '../forms/RegisterForm'
import ForgotPasswordForm from '../forms/ForgotPasswordForm'

export interface ILoginPageProps {
}
interface ILoginRouteArgs {
    type: string;
    data: string;
}
class LoginPage extends React.Component<ILoginPageProps & InjectedIntlProps & RouteComponentProps<ILoginRouteArgs>, any> {
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
        const { type, data } = this.props.match.params;
        const panes = [
            //! Attached false: Workaround for https://github.com/Semantic-Org/Semantic-UI-React/issues/3412
            { key: 'login', menuItem: this.props.intl.formatMessage({ id: 'user.login.label' }), pane: <Tab.Pane attached={false}><LoginForm /></Tab.Pane> },
            // { key: 'token', menuItem: this.props.intl.formatMessage({ id: 'user.token.login' }), pane: <Tab.Pane attached={false}><LoginTokenForm token={data} /></Tab.Pane> },
            { key: 'register', menuItem: this.props.intl.formatMessage({ id: 'user.register.label' }), pane: <Tab.Pane attached={false}><RegisterForm /></Tab.Pane> },
            { key: 'pw', menuItem: this.props.intl.formatMessage({ id: 'user.forgot_pw.label' }), pane: <Tab.Pane attached={false}><ForgotPasswordForm /></Tab.Pane> },
        ]
        var index = panes.findIndex((el) => el.key === type)
        index = index >= 0 ? index : 0
        return (
            <Tab onTabChange={this.onTabChange} activeIndex={index} renderActiveOnly={false} menu={{ attached: false, secondary: true, pointing: true }} panes={panes} />
        );
    }
}

export default injectIntl(LoginPage);;