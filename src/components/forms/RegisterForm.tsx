// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { FormBase } from './FormBase'
import { Form, CheckboxProps } from 'semantic-ui-react';
import * as user from '../../api/api.user';
import { connect } from 'react-redux';
import * as validate from '../../validator/validator';

export interface IRegisterFormProps {
}
class RegisterForm extends React.Component<IRegisterFormProps & WrappedComponentProps & { register: any }, any> {
    state: { data: user.IRegisterData & { tos: boolean, password2: string } } = {
        data: {
            name: '',
            email: '',
            password: '',
            password2: '',
            tos: false
        },
    }
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onCBtnChange = (e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        if (data.name === undefined) return;
        this.setState({ data: { ...this.state.data, [data.name]: data.checked } });
    }

    public render() {
        const nl = this.props.intl.formatMessage({ id: "auth.label.name" })
        const pwl = this.props.intl.formatMessage({ id: "auth.label.password" })
        const pwrl = this.props.intl.formatMessage({ id: "auth.label.password.repeat" })
        const usl = this.props.intl.formatMessage({ id: "auth.label.email" })
        const tosl = this.props.intl.formatMessage({ id: "auth.label.tos" })
        const { data } = this.state;
        return (
            <FormBase button="auth.label.submit" onSubmit={() => this.props.register(this.state.data)}>
                <Form.Input
                    icon="user"
                    iconPosition="left"
                    name="name"
                    label={nl}
                    placeholder={nl}
                    value={data.name}
                    onChange={this.onChange}
                    validator={() => validate.name(data.name)}
                />
                <Form.Input
                    icon="mail"
                    iconPosition="left"
                    name="email"
                    type="email"
                    label={usl}
                    placeholder={usl}
                    value={data.email}
                    onChange={this.onChange}
                    validator={() => validate.email(data.email)}
                />
                <Form.Input
                    icon="lock"
                    iconPosition="left"
                    name="password"
                    label={pwl}
                    placeholder={pwl}
                    type="password"
                    value={data.password}
                    onChange={this.onChange}
                    validator={() => validate.password(data.password)}
                />
                <Form.Input
                    icon="lock"
                    iconPosition="left"
                    name="password2"
                    placeholder={pwrl}
                    type="password"
                    value={data.password2}
                    onChange={this.onChange}
                    validator={() => validate.password2(data.password, data.password2)}
                />
                <Form.Checkbox
                    name="tos"
                    label={tosl}
                    checked={data.tos}
                    onChange={this.onCBtnChange}
                    validator={() => data.tos === true ? true : "error.tos"}
                />
            </FormBase>)
    }
}
export default connect(null, { register: user.register })(injectIntl(RegisterForm));
