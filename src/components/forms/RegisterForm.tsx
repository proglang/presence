// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { IRegisterData } from '../../user/auth'
import { FormBase } from './FormBase'
import InputField from '../util/ValidationInputField';
import { Form, CheckboxProps } from 'semantic-ui-react';


export interface IRegisterFormProps {
}
class RegisterForm extends React.Component<IRegisterFormProps & InjectedIntlProps, any> {
    state: { data: IRegisterData } = {
        data: {
            name: '',
            email: '',
            password: '',
            tos: false
        },
    }
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onCBtnChange = (e: React.FormEvent<HTMLInputElement>, data:CheckboxProps) => this.setState({ data: { ...this.state.data, [data.name||'']: data.value } });
    public render() {
        const nl = this.props.intl.formatMessage({ id: "auth.label.name" })
        const pwl = this.props.intl.formatMessage({ id: "auth.label.password" })
        const pwrl = this.props.intl.formatMessage({ id: "auth.label.password.repeat" })
        const usl = this.props.intl.formatMessage({ id: "auth.label.email" })
        const tosl = this.props.intl.formatMessage({ id: "auth.label.tos" })
        const { data } = this.state;
        //Todo: Input Validation
        //Todo: Submit Function
        return (
            <FormBase button="auth.label.submit" onSubmit={() => new Promise((res, rej) => res('test'))}>
                <InputField
                    icon="user"
                    iconPosition="left"
                    name="name"
                    label={nl}
                    placeholder={nl}
                    value={data.email}
                    onChange={this.onChange}
                    validator={() => { return true }}
                />
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
                <InputField
                    icon="lock"
                    iconPosition="left"
                    name="password2"
                    placeholder={pwrl}
                    type="password"
                    value={data.password}
                    onChange={this.onChange}
                />
                <Form.Checkbox
                    name="tos"
                    label={tosl}
                    value={data.password}
                    onChange={this.onCBtnChange}
                    />
            </FormBase>)
    }
}
export default injectIntl(RegisterForm);
