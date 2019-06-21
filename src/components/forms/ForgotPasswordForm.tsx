// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import React, { ChangeEvent } from 'react';
import {  injectIntl, InjectedIntlProps } from 'react-intl';
import { IForgottenPasswordData } from '../../user/auth'
import {LoginFormBase} from './LoginFormBase'
import InputField from '../fields/ValidationInputField';


export interface IForgotPasswordFormProps {
    token?:string;
}
class ForgotPasswordForm extends React.Component<IForgotPasswordFormProps & InjectedIntlProps, any> {
    state: { data: IForgottenPasswordData } = {
        data: {
            email: '',
        },
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    public render() {
        const el = this.props.intl.formatMessage({ id: "auth.email.label" })
        const { data } = this.state;
        //Todo: Input Validation
        //Todo: Submit Function
        return (
            <LoginFormBase button="auth.forgot_password.button" onSubmit={() => new Promise((res, rej) => res('test'))}>
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
            </LoginFormBase>)
    }
}
export default injectIntl(ForgotPasswordForm);
