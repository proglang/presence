// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect, DispatchProp } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import * as api from '../../api/api';
import { IValidationErrorMsg } from '../../validator/validator';

interface IFormBase_Errors {
    msg: IValidationErrorMsg[];
    global?: string;
    field: { [key: string]: boolean };
}
interface IFormBase_State {
    errors: IFormBase_Errors;
    loading: boolean;
}
interface IFormBaseProps {
    onSubmit: (val: Dispatch<AnyAction>) => Promise<any>;
    button: string;
}

class FormBaseNI extends React.Component<IFormBaseProps & DispatchProp & WrappedComponentProps, any> {
    _IsMounted = false;

    state: IFormBase_State = {
        errors: { msg: [], field: {} },
        loading: false
    }
    onSubmit(children: React.ReactNode) {
        const errors: IFormBase_Errors = { msg: [], field: {} };
        React.Children.forEach(children, (child) => {
            // Todo: Check Node Type -> Validation depending on type
            const tsnode = child as React.ReactElement;
            if (tsnode === null) return;
            const { validator, value, name } = tsnode.props
            var msg: string | true;
            if (!!validator && (msg = validator(value, tsnode.props)) !== true) {
                //@ts-ignore
                errors.msg.push(msg);
                errors.field[name] = true;
            }
        })
        //@ts-ignore
        this.setState({ errors, loading: !errors.msg.length > 0 });
        if (errors.msg.length > 0) return;

        this.props.onSubmit(this.props.dispatch)
            .then((res: api.IError | true) => {
                if (!this._IsMounted) return;
                this.setState({ loading: false })
                if (typeof (res) !== 'object') return;
                const errors: IFormBase_Errors = { msg: [], field: {} };
                const { validation, login } = res;
                if (validation) {
                    React.Children.forEach(children, (child) => {
                        // Todo: Check Node Type -> Validation depending on type
                        const tsnode = child as React.ReactElement;
                        if (tsnode === null) return;
                        const { name } = tsnode.props
                        if (validation.check(name)) {
                            //@ts-ignore
                            validation.getMessages(name).forEach(msg => errors.msg.push(msg))
                            errors.field[name] = true;
                        }
                    })
                } else if (login) {
                    errors.msg.push({ id: "error.logindata" });
                } else if (res.unhandled){
                    errors.msg.push({ id: "Error was not handled!!!" });
                }
                this.setState({ errors });
            })
            .catch((err: any) => {
                if (!this._IsMounted) return;
                this.setState({ loading: false })
                const errors: IFormBase_Errors = { msg: [], field: {} };
                if (err.response === undefined) {
                    errors.global = err.message + ": " + err.isAxiosError;
                } else {
                    errors.global = "Unknown Error!";
                }
                this.setState({ errors });
            })

    }
    public componentDidMount() {
        this._IsMounted = true;
    }
    public componentWillUnmount() {
        this._IsMounted = false;
    }
    public render() {
        const { errors, loading } = this.state;
        const { children, button } = this.props;
        // console.log(errors)
        return (
            <Form onSubmit={() => this.onSubmit(children)} loading={loading} error={Object.keys(errors).length !== 0}>
                {React.Children.map(children, (node, index) => {
                    const tsnode = node as React.ReactElement<any>;
                    if (tsnode === null) return;
                    const { validator, ...childProps } = tsnode.props;
                    return React.createElement(tsnode.type, { key: index, error: errors.field[tsnode.props.name], ...childProps })
                })}
                <Form.Button primary>{this.props.intl.formatMessage({ id: button })}</Form.Button>
                {(errors.global || errors.msg.length > 0) &&
                    <Message error>
                        <Message.List>
                            {errors.global && <Message.Item>{<FormattedMessage id={errors.global} />}</Message.Item>}
                            {errors.msg.map((item, index) => <Message.Item key={index}>{<FormattedMessage id={item.id} values={item.args} />}</Message.Item>)}
                        </Message.List>
                    </Message>}
            </Form>
        );

    }
}
export const FormBase = connect()(injectIntl(FormBaseNI));