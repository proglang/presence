// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Button, Container, Form } from 'semantic-ui-react';
import { IReduxRootProps } from '../../rootReducer';
import * as user from '../../api/api.user';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { setTitle } from '../../util/helper';
import { FormBase } from '../forms/FormBase';

export interface IUserPageProps {
}

export interface IUserPageState {
}

class UserPage extends React.Component<IUserPageProps & ReduxProps & ReduxFn & WrappedComponentProps, IUserPageState> {
    constructor(props: IUserPageProps & ReduxProps & ReduxFn & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }
    componentDidMount = () => {
        setTitle(this.props.intl.formatMessage({ id: "page.user" }))
    }

    export = () => {

        return new Promise((cb) => cb())
    }
    formats = [
        { key: "csv", value: "csv", text: "label.export.csv", single: true },
        { key: "xls", value: "xls", text: "label.export.xls" },
        { key: "xlsx", value: "xlsx", text: "label.export.xlsx" },
    ];
    public render() {
        return (
            <Container as="main">
                <FormBase button={"submit.export"} onSubmit={this.export}>
                    <Form.Dropdown
                        selection
                        options={this.formats}
                    />
                    <Form.Dropdown />
                </FormBase>
                <Button onClick={this.export}><FormattedMessage id={"label.export"} /></Button>
            </Container>
        );
    }
}

interface ReduxProps {
    user: user.IUserData;
}
interface ReduxFn {
    delete: any;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {

    return ({
        //@ts-ignore
        user: state.user
    })
}
export default connect(mapStateToProps, { delete: user.del })(injectIntl(UserPage))