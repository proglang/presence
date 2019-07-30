// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { IExamStudentDataList, IExamStudentData } from '../../api/examStudentData';
import { IReduxRootProps } from '../../rootReducer';
import { TabProps, Container, Tab, Button } from 'semantic-ui-react';
import FilterTable from '../util/FilterTable';

export interface IExamStudentPageProps {
}

export interface IExamStudentPageState {
}

class ExamStudentPage extends React.Component<IExamStudentPageProps & RouteComponentProps<any> & InjectedIntlProps & ReduxProps, IExamStudentPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
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
    const data = this.props.es.map((value: IExamStudentData): any[] => [
      value.name,
      value.sid,
      [
        <Button key="1" basic icon='edit' onClick={() => this.setState({ popup: [value.sid] })} />,
      ]
    ])
    return data;
  }
  public render() {
    const { type } = this.props.match.params;
    const panes = [
      //! Attached false: Workaround for https://github.com/Semantic-Org/Semantic-UI-React/issues/3412
      //! key in pane needed: Workaround for React Warning
      { key: 'list', menuItem: this.props.intl.formatMessage({ id: 'common.label.list' }), pane: null },
      { key: 'add1', menuItem: this.props.intl.formatMessage({ id: 'common.label.addMulti' }), pane: <Tab.Pane key="3" attached={false}></Tab.Pane> },
      { key: 'add2', menuItem: this.props.intl.formatMessage({ id: 'common.label.addSingle' }), pane: <Tab.Pane key="4" attached={false}></Tab.Pane> },
    ]
    var index = panes.findIndex((el) => el.key === type)
    index = index >= 0 ? index : 0
    return (
      <Container as="main">
        {false && <Tab
          //Todo: Add Check if students can be added
          onTabChange={this.onTabChange}
          activeIndex={index}
          renderActiveOnly={false}
          menu={{ attached: false, secondary: true, pointing: true }}
          panes={panes}
        />}
        <FilterTable
          format={{ 1: { collapsing: true }}}
          sortable={{ 0: true, 1: true }}
          header={["common.name", "common.matrikel", ""]}
          data={this.getTable()}
          filter={{ 0: true, 1: true }}
        />
      </Container>
    );
  }
}

interface ReduxProps {
  es: IExamStudentDataList
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  return ({
    es: state.es
  })
}
export default connect(mapStateToProps)(injectIntl(ExamStudentPage))
