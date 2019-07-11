// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import * as ExamUserForms from '../forms/AddUserForms'
import { Container, Tab, TabProps, Button, Popup, Icon, Checkbox } from 'semantic-ui-react';
import { injectIntl, InjectedIntlProps, FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom'
import FilterTable from "../util/FilterTable";
import EditUserForm from "../forms/EditUserForm";

import { connect } from 'react-redux';
import { IExamUserData } from '../../api/examUserData';

export interface IExamUserPageProps {
}
export interface IExamUserPageState {
  popup: string[]
  selected: { [key: string]: boolean }
}

class ExamUserPage extends React.Component<IExamUserPageProps & RouteComponentProps<any> & InjectedIntlProps & ReduxProps, IExamUserPageState> {
  constructor(props: IExamUserPageProps & RouteComponentProps<any> & InjectedIntlProps & ReduxProps) {
    super(props);

    this.state = {
      popup: [],
      selected: {}
    }
  }
  onTabChange = (event: any, data: TabProps) => {
    if (!data.panes || typeof (data.activeIndex) !== 'number') return;
    const path = this.props.match.path
    const basepath = path.substr(0, path.indexOf('/:'))
    if (data.activeIndex === 0)
      return this.props.history.push(basepath)
    const pane: any = data.panes[data.activeIndex]
    this.props.history.push(basepath + "/" + pane.key);
  }
  getTable = () => {
    const data = this.props.eu.map((value: IExamUserData): any[] => [
      <Checkbox
        checked={!!this.state.selected[value.email]}
        onChange={() => this.setState({ selected: { ...this.state.selected, [value.email]: !this.state.selected[value.email] } })}
      />,
      value.name,
      value.email,
      // Todo: Center Icon
      !value.useDate ? <Icon color='red' name='cancel' /> : <Icon color='green' name='checkmark' />,
      [
        //Todo: Loca
        <Popup key="0" trigger={<Button basic icon='info circle' />} content={
          [
            //Todo: Loca + Formatting
            <h3 key='1'>{value.name}</h3>,
            <p key='2'>EMail: {value.email}</p>,
            <p key='5'>Note: {value.note}</p>,
            <p key='6'>Token: {value.token}</p>,
            value.useDate && <p key="7"><FormattedDate value={value.useDate} /> <FormattedTime value={value.useDate} /></p>,
            value.createDate && <p key="8"><FormattedDate value={value.createDate} /> <FormattedTime value={value.createDate} /></p>
          ]
        } />,
        <Popup key="1" trigger={<Button basic icon='edit' onClick={() => this.setState({ popup: [value.email] })} />} content={(<FormattedMessage id="EDIT" />)} />
      ]
    ])
    return data;
  }
  public render() {
    const { type/*, data*/ } = this.props.match.params;
    const panes = [
      //! Attached false: Workaround for https://github.com/Semantic-Org/Semantic-UI-React/issues/3412
      //! key in pane needed: Workaround for React Warning
      { key: 'list', menuItem: this.props.intl.formatMessage({ id: 'user.list.label' }), pane: null },
      { key: 'add1', menuItem: this.props.intl.formatMessage({ id: 'user.list.add.label' }), pane: <Tab.Pane key="3" attached={false}><ExamUserForms.AddUserListForm /></Tab.Pane> },
      { key: 'add2', menuItem: this.props.intl.formatMessage({ id: 'user.list.add2.label' }), pane: <Tab.Pane key="4" attached={false}><ExamUserForms.AddUserForm /></Tab.Pane> },
    ]
    var index = panes.findIndex((el) => el.key === type)
    index = index >= 0 ? index : 0
    return (
      <Container as="main">
        <Tab
          onTabChange={this.onTabChange}
          activeIndex={index}
          renderActiveOnly={false}
          menu={{ attached: false, secondary: true, pointing: true }}
          panes={panes}
        />
        <FilterTable
          format={{ 0: { collapsing: true }, 3: { collapsing: true }, 4: { collapsing: true } }}
          //Todo: Loca
          sortable={{ 1: true, 2: true }}
          header={[<Popup key="1" trigger={<Button basic icon='edit' onClick={() => this.setState({ popup: Object.keys(this.state.selected) })} />} content={(<FormattedMessage id="EDIT" />)} />, "Name", "Email", "Verified", ""]}
          data={this.getTable()}
          filter={{ 1: true, 2: true }}
        />
        <EditUserForm
          onClose={() => this.setState({ popup: [] })}
          data={this.state.popup}
        />
      </Container>
    );
  }
}

interface ReduxProps {
  eu: IExamUserData[]
}
const mapStateToProps = (state: { eu: IExamUserData[] }): ReduxProps => {
  return ({
    eu: state.eu
  })
}
export default connect(mapStateToProps)(injectIntl(ExamUserPage))