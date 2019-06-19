// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Message, Icon, Button, Accordion } from 'semantic-ui-react'

export interface ICodeErrorProps {
    data?: any;
    canReport?: boolean;
}
export interface IErrorProps extends ICodeErrorProps {
    code: number;
}
// Todo: Translate Errorpages
class ErrorInternal extends React.Component<IErrorProps & RouteComponentProps<{}>> {
    public render() {
        const { code, children, data, location, canReport } = this.props;
        const js = JSON.stringify({ code: code, data: data, page: location.pathname });
        return (
            <div>
                {children}
                <Message icon info>
                    <Icon name="bug" />
                    <Message.Content>
                        <Message.Header>__loca__ Additional Information</Message.Header>
                        <Message.List>
                            <Message.Item>__loca__ Code: {code}</Message.Item>
                            <Message.Item>__loca__ Page: {location.pathname}</Message.Item>
                        </Message.List>
                        {data!==undefined && <Accordion panels={[ {key:'details', title: '__loca__ Additional Data', content:JSON.stringify(data)} ] }/>}
                        {canReport && <Button onClick={() => console.log(js)}>__loca__ Send Report! (Todo)</Button>}
                    </Message.Content>
                </Message>
            </div>
        );
    }
}
export const Error = withRouter(ErrorInternal);

class Error404Internal extends React.Component<ICodeErrorProps & RouteComponentProps<{}>> {
    public render() {
        return (
                <Error {...this.props} code={404}>
                    <Message icon error>
                        <Icon name="exclamation triangle" />
                        <Message.Content>
                            <Message.Header>__loca__ Page not found!</Message.Header>
                            <i>{this.props.location.pathname}</i><br />
                            __loca__ We could not find the above page on our servers.
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