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

export interface ILoginFormProps {
}
interface ILoginFormState {
    data: user.IRegisterData & { password2: string }
    register: boolean
}
class LoginForm extends React.Component<ILoginFormProps & WrappedComponentProps & ReduxFn, ILoginFormState> {
    state = {
        data: {
            name: '',
            email: '',
            password: '',
            password2: '',
        },
        register: false
    }
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onCBtnChange = (e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        if (data.name === undefined) return;
        this.setState({ data: { ...this.state.data, [data.name]: data.checked } });
    }
    submit = () => {
        const { registerUser, loginUser } = this.props;
        const { register, data } = this.state
        if (register)
            return registerUser(data)
        return loginUser({ email: data.email, password: data.password })
    }
    public render() {
        const nl = this.props.intl.formatMessage({ id: "label.name" })
        const pwl = this.props.intl.formatMessage({ id: "label.password" })
        const pwrl = this.props.intl.formatMessage({ id: "label.password.repeat" })
        const usl = this.props.intl.formatMessage({ id: "label.email" })
        // const tosl = this.props.intl.formatMessage({ id: "label.tos" })
        const { data, register } = this.state;
        return (
            <FormBase
                button={register ? "submit.register" : "submit.login"}
                onSubmit={this.submit}
            >
                <Form.Checkbox
                    toggle
                    label={this.props.intl.formatMessage({ id: "label.register" })}
                    checked={register}
                    onChange={() => this.setState({ register: !register })}
                />
                {register && <Form.Input
                    required
                    icon="user"
                    iconPosition="left"
                    name="name"
                    label={nl}
                    placeholder={nl}
                    value={data.name}
                    onChange={this.onChange}
                    validator={null/*() => validate.name(data.name)*/}
                />}
                <Form.Input
                    icon="mail"
                    iconPosition="left"
                    name="email"
                    type="email"
                    label={usl}
                    placeholder={usl}
                    value={data.email}
                    onChange={this.onChange}
                    required
                    validator={null/*() => validate.email(data.email)*/}
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
                    required
                    validator={null /*() => validate.password(data.password)*/}
                />
                {register && <Form.Input
                    icon="lock"
                    iconPosition="left"
                    name="password2"
                    placeholder={pwrl}
                    type="password"
                    value={data.password2}
                    onChange={this.onChange}
                    validator={() => validate.password2(data.password, data.password2)}
                />}

                {/*<Form.Checkbox
                    name="tos"
                    label={tosl}
                    checked={data.tos}
                    onChange={this.onCBtnChange}
                    validator={() => data.tos === true ? true : {id: "validation.tos"}}
                />*/}
            </FormBase>)
    }
}


interface ReduxFn {
    registerUser: any;
    loginUser: any;
}

export default connect(null, { registerUser: user.register, loginUser: user.login })(injectIntl(LoginForm));
