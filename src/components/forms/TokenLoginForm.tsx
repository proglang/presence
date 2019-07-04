// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import React, { ChangeEvent } from 'react';
import {  injectIntl, InjectedIntlProps } from 'react-intl';
import { ITokenLoginData } from '../../api/auth'
import {FormBase} from './FormBase'
import InputField from '../util/ValidationInputField';


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
        const pwl = this.props.intl.formatMessage({ id: "auth.label.password" })
        const el = this.props.intl.formatMessage({ id: "auth.label.email" })
        const tl = this.props.intl.formatMessage({ id: "auth.label.token" })
        const { data } = this.state;
        // Todo: Input Validation
        // Todo: Add QR-Code Scanner
        //Todo: Submit Function
        return (
            <FormBase button="auth.label.submit.token" onSubmit={() => new Promise((res, rej) => res('test'))}>
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
            </FormBase>)
    }
}
export default injectIntl(TokenLoginForm);
