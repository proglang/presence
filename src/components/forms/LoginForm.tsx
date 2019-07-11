// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent } from 'react';
import {  injectIntl, InjectedIntlProps } from 'react-intl';
import { ILoginData, login } from '../../api/auth'
import {FormBase} from './FormBase'
import InputField from '../util/ValidationInputField';
import { connect } from 'react-redux';


export interface ILoginFormProps {
}
class LoginForm extends React.Component<ILoginFormProps & InjectedIntlProps & {login: any}, any> {
    state: { data: ILoginData } = {
        data: {
            email: '',
            password: ''
        },
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    public render() {
        const pwl = this.props.intl.formatMessage({ id: "auth.label.password" })
        const usl = this.props.intl.formatMessage({ id: "auth.label.email" })
        const { data } = this.state;
        //Todo: Input Validation
        //Todo: Submit Function
        return (
            <FormBase button="auth.label.submit.login" onSubmit={()=>this.props.login(this.state.data)}>
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
            </FormBase>)
    }
}
export default connect(null, {login})(injectIntl(LoginForm));
