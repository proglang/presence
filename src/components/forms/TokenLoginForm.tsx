// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import React, { ChangeEvent } from 'react';
import {  injectIntl, InjectedIntlProps } from 'react-intl';
import { ITokenLoginData } from '../../user/auth'
import {LoginFormBase} from './LoginFormBase'
import InputField from '../fields/ValidationInputField';


export interface ITokenLoginFormProps {
    token?:string;
}
class TokenLoginForm extends React.Component<ITokenLoginFormProps & InjectedIntlProps, any> {
    state: { data: ITokenLoginData } = {
        data: {
            email: '',
            password: '',
            token: this.props.token||''
        },
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    public render() {
        const pwl = this.props.intl.formatMessage({ id: "auth.password.label" })
        const el = this.props.intl.formatMessage({ id: "auth.email.label" })
        const tl = this.props.intl.formatMessage({ id: "auth.token.label" })
        const { data } = this.state;
        // Todo: Input Validation
        // Todo: Add QR-Code Scanner
        //Todo: Submit Function
        return (
            <LoginFormBase button="auth.token.button" onSubmit={() => new Promise((res, rej) => res('test'))}>
                <InputField
                    icon="user"
                    iconPosition="left"
                    name="email"
                    type="email"
                    label={el}
                    placeholder={el}
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
                <InputField
                    icon="lock"
                    iconPosition="left"
                    name="token"
                    label={tl}
                    placeholder={tl}
                    type="text"
                    value={data.token}
                    onChange={this.onChange}
                />
            </LoginFormBase>)
    }
}
export default injectIntl(TokenLoginForm);
