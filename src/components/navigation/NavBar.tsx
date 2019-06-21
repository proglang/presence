// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Icon, Image, Menu, Sidebar, Container, Popup, Responsive, IconProps } from "semantic-ui-react";
import { NavLink as Link, NavLinkProps, withRouter, RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

interface INavLinkItem {
    mobile?: boolean;
    sidebar?: boolean;
    link: NavLinkProps;
    icon?: IconProps;
    label?: string;
}
class _NavLinkItem extends React.Component<INavLinkItem & RouteComponentProps<{}>> {
    public render() {
        const { mobile, link, icon, label, location } = this.props;
        if (!mobile) { // Desktop
            return (
                <Popup basic content={label && <FormattedMessage id={label} />} disabled={!icon || !label} trigger={
                    <Link {...link} className="item" activeClassName="active" location={location} exact={link.exact === undefined ? true : link.exact}>
                        {icon && <Icon {...icon} />}
                        {!icon && label && <FormattedMessage id={label} />}
                    </Link>} />
            );
        }
        return ( // Mobile
            <Link {...link} className="item" activeClassName="active" location={location} exact={link.exact === undefined ? true : link.exact}>
                {icon && <Icon {...icon} />}
                {label && <FormattedMessage id={label} />}
            </Link>
        );
    }
}
const NavLinkItem = withRouter(_NavLinkItem);

const getLeft = [
    <NavLinkItem link={{ to: "/", exact: true }} label="nav.home" />,
    <NavLinkItem link={{ to: "/login", exact: false }} icon={{ name: "sign in" }} label="Login" />,
    <NavLinkItem link={{ to: "/login", exact: false }} icon={{ name: "sign in" }} label="Login" />
]
const getRight = [
    <NavLinkItem link={{ to: "/login", exact: false }} icon={{ name: "sign in" }} label="nav.login" />
]


export default class NavBar extends React.Component<any> {
    state = {
        visible: false
    }

    handlePusher = () => {
        const { visible } = this.state;
        if (visible) this.setState({ visible: false });
    };
    handleToggle = () => this.setState({ visible: !this.state.visible });

    public render() {
        const { visible } = this.state;
        return (
            <nav>
                {/*Mobile*/}
                <Responsive maxWidth={Responsive.onlyComputer.minWidth}>
                    <Menu fixed="top" inverted>
                        <Menu.Item>
                            <Image size="mini" src="/favicon.ico" />
                        </Menu.Item>
                        <Menu.Item onClick={this.handleToggle}>
                            <Icon name="sidebar" />
                        </Menu.Item>
                        <Menu.Menu position="right">
                            {getRight.map((item, index) => React.cloneElement(item, { key: index, mobile: true }))}
                        </Menu.Menu>
                    </Menu>
                    <Sidebar
                        as={Menu}
                        animation="overlay"
                        icon="labeled"
                        inverted
                        vertical
                        visible={visible}
                    >
                        {getLeft.map((item, index) => React.cloneElement(item, { key: index, mobile: true, sidebar: true }))}
                    </Sidebar>
                </Responsive>
                {/*Desktop PC*/}
                <Responsive minWidth={Responsive.onlyComputer.minWidth} className="menu">
                    <Menu fixed="top" inverted>
                        <Menu.Item>
                            <Image size="mini" src="/favicon.ico" />
                        </Menu.Item>
                        {getLeft.map((item, index) => React.cloneElement(item, { key: index }))}
                        <Menu.Menu position="right">
                            {getRight.map((item, index) => React.cloneElement(item, { key: index }))}
                        </Menu.Menu>
                    </Menu>
                </Responsive>
                {visible && <div onClick={this.handlePusher} style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 101 }} />}

                <Container style={{ paddingTop: "5em" }} />
            </nav>
        );
    }
}
