// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import {connect, DispatchProp} from 'react-redux';
import { Dispatch, AnyAction } from 'redux';

interface ILoginFormBase_Errors {
    msg?: string[];
    global?: string;
    [key: string]: boolean | string | string[] | undefined;
}
interface ILoginFormBase_State {
    errors: ILoginFormBase_Errors;
    loading: boolean;
}
interface ILoginFormBaseProps extends InjectedIntlProps {
    onSubmit: (val:Dispatch<AnyAction>) => Promise<any>;
    button: string;
}

class LoginFormBaseNI extends React.Component<ILoginFormBaseProps & DispatchProp, any> {
    state: ILoginFormBase_State = {
        errors: {},
        loading: false
    }
    onSubmit(children: React.ReactNode) {
        const errors: ILoginFormBase_Errors = {};
        errors.msg = []
        React.Children.forEach(children, (child) => {
            // Todo: Check Node Type -> Validation depending on type
            const tsnode = child as React.ReactElement;
            const { validator, value, name } = tsnode.props
            var msg: string | true;
            if (!!validator && (msg = validator(value, tsnode.props)) !== true) {
                //@ts-ignore
                errors.msg.push(msg);
                errors[name] = true;
            }
        })
        if (errors.msg.length === 0) delete errors.msg;
        this.setState({ errors, loading: !errors.msg });
        if (errors.msg) return;

        this.props.onSubmit(this.props.dispatch)
            .then(() => this.setState({ loading: false }))
            .catch((err: any) => {
                if (err.response === undefined) {
                    this.setState({ errors: { global: err.message + ": " + err.isAxiosError }, loading: false })
                } else {
                    this.setState({ errors: err.response.data.errors, loading: false })
                }
            })

    }
    public render() {
        const { errors, loading } = this.state;
        const { children, button } = this.props;
        return (
            <Form onSubmit={() => this.onSubmit(children)} loading={loading} error={Object.keys(errors).length !== 0}>
                {React.Children.map(children, node => {
                    const tsnode = node as React.ReactElement<any>;
                    return React.cloneElement(tsnode, { error: errors[tsnode.props.name] })
                })}
                <Form.Button fluid primary>{this.props.intl.formatMessage({ id: button })}</Form.Button>
                <Message error>
                    <Message.List>
                        {errors.global && <Message.Item>{<FormattedMessage id={errors.global} />}</Message.Item>}
                        {errors.msg && errors.msg.map(item => <Message.Item key={item}>{<FormattedMessage id={item} />}</Message.Item>)}
                    </Message.List>
                </Message>
            </Form>
        );

    }
}
export const LoginFormBase = connect()(injectIntl(LoginFormBaseNI));