// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Icon, Image, Menu, Sidebar, Container, Popup, Responsive, IconProps } from "semantic-ui-react";
import { NavLink as Link, NavLinkProps, withRouter, RouteComponentProps } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { TRights, TRight } from '../../api/api.exam.user';
import { IReduxRootProps } from '../../rootReducer';

import Logo from '../../_res/logo.png';
// import ExamSelectionDropdown from './ExamSelection';

interface INavLinkItem {
    mobile?: boolean;
    sidebar?: boolean;
    link: NavLinkProps;
    icon?: IconProps;
    label?: string;
    type: "guest" | "public" | "user";
    right?: TRight;
}
class _NavLinkItem extends React.Component<INavLinkItem & ReduxProps & RouteComponentProps<{}>> {
    public render() {
        const { mobile, link, icon, label, location, type, redux } = this.props;
        if (type === "guest" && !!redux.login) {
            return null;
        }
        if (type === "user") {
            if (!redux.login) return null;
            if (this.props.right) {
                if (!redux.access) return null;
                if (!redux.access[this.props.right]) return null;
            }
        }
        if (!mobile) { // Desktop
            return (
                <Popup basic content={label && <FormattedMessage id={label} />} disabled={!icon || !label} trigger={
                    <Link {...link} to={String(link.to).replace("<ID>", redux.selected ? String(redux.selected) : '')} className="item" activeClassName="active" location={location} exact={link.exact === undefined ? true : link.exact}>
                        {icon && <Icon {...icon} />}
                        {!icon && label && <FormattedMessage id={label} />}
                    </Link>} />
            );
        }
        return ( // Mobile
            <Link {...link} to={String(link.to).replace("<ID>", redux.selected ? String(redux.selected) : '')} className="item" activeClassName="active" location={location} exact={link.exact === undefined ? true : link.exact}>
                {icon && <Icon {...icon} />}
                {label && <FormattedMessage id={label} />}
            </Link>
        );
    }
}

interface ReduxProps {
    redux: {
        login: boolean;
        access?: TRights;
        selected?: number;
    }
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const selected = state.exams.selected;
    const exam = selected ? state.exams[selected] : undefined;
    const access = exam ? exam.rights : undefined;
    return ({
        redux: {
            login: !!state.user,
            access: access,
            selected
        }
    })
}

const NavLinkItem = connect(mapStateToProps)(withRouter(_NavLinkItem));

const getLeft = [
    //    <NavLinkItem type="public" link={{ to: "/", exact: true }} icon={{ name: "home" }} label="nav.home" />,

    <NavLinkItem type="user" link={{ to: "/exam/list", exact: false }} icon={{ name: "clipboard" }} label="nav.exam.list" />,
    <NavLinkItem type="user" right={'exam_viewstudent'} link={{ to: `/exam/<ID>/student`, exact: false }} icon={{ name: "graduation cap" }} label="nav.exam.student" />,
    <NavLinkItem type="user" right={'exam_viewuser'} link={{ to: `/exam/<ID>/user`, exact: false }} icon={{ name: "address book" }} label="nav.exam.user" />,
    <NavLinkItem type="user" right={'exam_viewlog'} link={{ to: `/exam/<ID>/log`, exact: false }} icon={{ name: "tasks" }} label="nav.exam.log" />,

    // <NavLinkItem type="public" link={{ to: "/about", exact: false }} icon={{ name: "question circle" }} label="nav.about" />
]
const getRight = [
    <NavLinkItem type="user" link={{ to: "/user", exact: true }} icon={{ name: "user" }} label="nav.user" />,
    // <NavLinkItem type="public" link={{ to: "/config", exact: false }} icon={{ name: "settings" }} label="nav.config" />,
    <NavLinkItem type="guest" link={{ to: "/login", exact: false }} icon={{ name: "sign in" }} label="nav.login" />,
    <NavLinkItem type="user" link={{ to: "/logout", exact: false }} icon={{ name: "log out" }} label="nav.logout" />
]


export default class NavBar extends React.Component<{}> {
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
                            <Image size="mini" src={Logo} />
                        </Menu.Item>
                        <Menu.Item onClick={this.handleToggle}>
                            <Icon name="sidebar" />
                        </Menu.Item>
                        <Menu.Menu position="right">
                            {null /*<ExamSelectionDropdown />*/}
                            {getRight.map((item, index) => React.cloneElement(item, { key: index, mobile: true }))}
                        </Menu.Menu>
                    </Menu>
                    <Sidebar
                        as={Menu}
                        animation="overlay"
                        icon="labeled"
                        inverted
                        vertical
                        width="thin"
                        visible={visible}
                    >
                        {getLeft.map((item, index) => React.cloneElement(item, { key: index, mobile: true, sidebar: true }))}
                    </Sidebar>
                </Responsive>
                {/*Desktop PC*/}
                <Responsive minWidth={Responsive.onlyComputer.minWidth} className="menu">
                    <Menu fixed="top" inverted>
                        <Menu.Item>
                            <Image size="mini" src={Logo} />
                        </Menu.Item>
                        {getLeft.map((item, index) => React.cloneElement(item, { key: index }))}
                        <Menu.Menu position="right">
                            {null /*<ExamSelectionDropdown />*/}
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
