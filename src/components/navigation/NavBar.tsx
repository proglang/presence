// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Icon, Image, Menu, Sidebar, Container, Responsive, IconProps } from "semantic-ui-react";
import { NavLink as Link, NavLinkProps,withRouter,RouteComponentProps} from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { ResponsiveOnUpdateData } from 'semantic-ui-react/dist/commonjs/addons/Responsive';


/*
interface INavItemProps {
    isMobile: boolean;
    mobile?: React.ReactNode;
}
class NavItem extends React.Component<INavItemProps, any> {
    public render() {
        return (this.props.isMobile ? this.props.mobile : this.props.children);
    }
}
*/


interface INavLinkItem {
    isMobile: boolean;
    link: NavLinkProps;
    icon?: IconProps;
    label?:string;
}
class _NavLinkItem extends React.Component<INavLinkItem & RouteComponentProps<{}> & InjectedIntlProps> {
    public render() {
        const { link, icon, label, isMobile,location } = this.props;
        if (!isMobile) {
            return (
                <Link {...link} className="item" activeClassName="active" location={location} exact={link.exact===undefined?true:link.exact}>
                    {icon && <Icon {...icon} />}
                    {label && <FormattedMessage id={label} />}
                </Link>
            );
        }
        return (
            <Link {...link} className="item" activeClassName="active" location={location} exact={link.exact===undefined?true:link.exact}>
                {icon && <Icon {...icon} />}
                {!icon && label && <FormattedMessage id={label} />}
            </Link>
        );
    }
}
const NavLinkItem = withRouter(injectIntl(_NavLinkItem));

const getLeft = (mobile: boolean): {data:(key:number)=>React.ReactNode}[] => [
    { data:(key)=><NavLinkItem key={key} isMobile={mobile} link={{to:"/test"}} label="abc"/> }
]
const getRight = (mobile: boolean): {data:(key:number)=>React.ReactNode}[] => [
    { data:(key)=><NavLinkItem key={key} isMobile={mobile} link={{to:"/login", exact: false}} label="Login"/> }
]


export default class NavBar extends React.Component<any> {
    state = {
        visible: false,
        isMobile: false
    }

    handlePusher = () => {
        const { visible } = this.state;
        if (visible) this.setState({ visible: false });
    };
    handleToggle = () => this.setState({ visible: !this.state.visible });

    onWidthChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: ResponsiveOnUpdateData) => {
        const w = data.width < Number(Responsive.onlyComputer.minWidth);
        const m = this.state.isMobile
        if (w && !m) {
            this.setState({ isMobile: true });
        } else if (!w && m) {
            this.setState({ isMobile: false });
        }
    }
    public render() {
        const { children } = this.props;
        const { visible, isMobile } = this.state;
        const left = getLeft(isMobile);
        const right = getRight(isMobile);
        return (
            <Responsive fireOnMount onUpdate={this.onWidthChange}>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation="overlay"
                        icon="labeled"
                        inverted
                        vertical
                        visible={visible && isMobile}
                    >
                        {left.map((item, index)=>{return item.data(index)})}
                    </Sidebar>
                    <Sidebar.Pusher
                        dimmed={visible && isMobile}
                        onClick={this.handlePusher}
                        style={{ minHeight: "100vh" }}
                    >
                        <Menu fixed="top" inverted>
                            <Menu.Item>
                                <Image size="mini" src="/favicon.ico" />
                            </Menu.Item>
                            {isMobile?
                                <Menu.Item onClick={this.handleToggle}>
                                    <Icon name="sidebar" />
                                </Menu.Item>:left.map((item, index)=>{return item.data(index)})
                            }
                            <Menu.Menu position="right">
                                {right.map((item, index)=>{return item.data(index)})}
                            </Menu.Menu>
                        </Menu>
                        <Container style={{ paddingTop: "5em" }}>{children}</Container>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Responsive>
        );
    }
}
