// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { FormBase } from './FormBase'
import { connect } from 'react-redux';
import * as user from '../../api/api.user';
import { Form } from 'semantic-ui-react';
import * as validate from '../../validator/validator';


export interface ILoginFormProps {
}
class LoginForm extends React.Component<ILoginFormProps &  WrappedComponentProps & { login: any }, any> {
    state: { data: user.ILoginData } = {
        data: {
            email: '',
            password: ''
        },
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    public render() {
        const pwl = this.props.intl.formatMessage({ id: "label.password" })
        const usl = this.props.intl.formatMessage({ id: "label.email" })
        const { data } = this.state;
        //Todo: Input Validation
        //Todo: Submit Function
        return (
            <FormBase button="submit.login" onSubmit={() => this.props.login(this.state.data)}>
                <Form.Input
                    icon="user"
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
                    type="password"
                    label={pwl}
                    placeholder={pwl}
                    value={data.password}
                    onChange={this.onChange}
                    validator={() => validate.password(data.password)}
                />
            </FormBase>)
    }
}
export default connect(null, { login: user.login })(injectIntl(LoginForm));
