// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent } from 'react';
import {  injectIntl, InjectedIntlProps } from 'react-intl';
import { ILoginData } from '../../user/auth'
import {LoginFormBase} from './LoginFormBase'
import InputField from '../fields/ValidationInputField';


export interface ILoginFormProps {
}
class LoginForm extends React.Component<ILoginFormProps & InjectedIntlProps, any> {
    state: { data: ILoginData } = {
        data: {
            email: '',
            password: ''
        },
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    public render() {
        const pwl = this.props.intl.formatMessage({ id: "auth.password.label" })
        const usl = this.props.intl.formatMessage({ id: "auth.email.label" })
        const { data } = this.state;
        //Todo: Input Validation
        //Todo: Submit Function
        return (
            <LoginFormBase button="auth.login.button" onSubmit={() => new Promise((res, rej) => res('test'))}>
                <InputField
                    icon="user"
                    iconPosition="left"
                    name="email"
                    type="email"
                    label={usl}
                    placeholder={usl}
                    value={data.email}
                    onChange={this.onChange}
                    validator={() => { return true }}
                />
                <InputField
                    icon="lock"
                    iconPosition="left"
                    name="password"
                    label={pwl}
                    placeholder={pwl}
                    type="password"
                    value={data.password}
                    onChange={this.onChange}
                />
            </LoginFormBase>)
    }
}
export default injectIntl(LoginForm);
