// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Message, Icon, Button, Accordion, Container } from 'semantic-ui-react'
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { setTitle } from '../../util/helper';

export interface ICodeErrorProps {
    data?: any;
    canReport?: boolean;
}
export interface IErrorProps extends ICodeErrorProps {
    code: number;
}
class ErrorInternal extends React.Component<IErrorProps & RouteComponentProps<any> & WrappedComponentProps> {
    componentDidMount = () => {
        setTitle(this.props.intl.formatMessage({ id: "page.error" }))
    }
    public render() {
        const { code, children, data, location, canReport } = this.props;
        const js = JSON.stringify({ code: code, data: data, page: location.pathname });
        return (
            <Container as="main">
                {children}
                <Message icon info>
                    <Icon name="bug" />
                    <Message.Content>
                        <Message.Header><FormattedMessage id="error.additionalInfo" /></Message.Header>
                        <Message.List>
                            <Message.Item><FormattedMessage id="error.code" defaultMessage="Code: {code}" values={{ code }} /></Message.Item>
                            <Message.Item><FormattedMessage id="error.page" defaultMessage="Page: {page}" values={{ page: location.pathname }} /></Message.Item>
                        </Message.List>
                        {data !== undefined && <Accordion panels={[{ key: 'details', title: <FormattedMessage id="error.additionalData" />, content: JSON.stringify(data) }]} />}
                        {canReport && <Button onClick={() => console.log(js)}><FormattedMessage id="error.send" /></Button>}
                    </Message.Content>
                </Message>
            </Container>
        );
    }
}
export const Error = injectIntl(withRouter(ErrorInternal));

class Error404Internal extends React.Component<ICodeErrorProps & RouteComponentProps<{}>> {
    public render() {
        return (
            <Error {...this.props} code={404}>
                <Message icon error>
                    <Icon name="exclamation triangle" />
                    <Message.Content>
                        <Message.Header><FormattedMessage id="error.404.header" /></Message.Header>
                        <i>{this.props.location.pathname}</i><br />
                        <FormattedMessage id="error.404.message" />
                    </Message.Content>
                </Message>
            </Error>
        );
    }
}
export const Error404 = withRouter(Error404Internal);
export class Error401 extends React.Component<ICodeErrorProps> {
    public render() {
        return (<Error {...this.props} code={401} />);
    }
}

export class ErrorConfig extends React.Component<ICodeErrorProps> {
    public render() {
        return (
            <Error {...this.props} code={500}>
                <Message icon error>
                    <Icon name="exclamation triangle" />
                    <Message.Content>
                        <Message.Header>App Configuration Error</Message.Header>
                        <p>./config.js not found!</p>
                    </Message.Content>
                </Message>
            </Error>);
    }
}