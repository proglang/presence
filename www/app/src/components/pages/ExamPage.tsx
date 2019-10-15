// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import * as React from 'react';
import { connect } from 'react-redux';
import { IReduxRootProps } from '../../rootReducer';
import { Container, Popup, Button, Modal } from 'semantic-ui-react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import ObjectTable from '../table/ObjectTable';
import { withRouter, RouteComponentProps } from 'react-router';
import ExamForm from '../forms/ExamForm';
import { getDateTimeString } from '../../util/time';
import DeleteExamModal from '../modal/DeleteExamModal';
import * as exam from '../../api/api.exam';
import { setTitle } from '../../util/helper';

class Table extends ObjectTable<exam.IData> { }

export interface IExamPageProps {
}

export interface IExamPageState {
  loading: boolean;
  editing: boolean;
}

export interface IRouterParams {
  new: any;
}
class ExamPage extends React.Component<IExamPageProps & ReduxProps & ReduxFn & WrappedComponentProps & RouteComponentProps<IRouterParams>, IExamPageState> {
  constructor(props: IExamPageProps & ReduxProps & ReduxFn & WrappedComponentProps & RouteComponentProps<IRouterParams>) {
    super(props);
    this.state = {
      loading: false,
      editing: false
    }
  }
  componentDidMount = () => {
    setTitle(this.props.intl.formatMessage({ id: "page.exam" }))
    //| Send Request to Server
    if (Object.keys(this.props.exams).length === 0)
      this.refreshTable();
  }
  refreshTable = () => {
    if (this.state.loading) return;
    this.setState({ loading: true });
    this.props.load().then(() => this.setState({ loading: false })).catch(() => this.setState({ loading: false }))
  }
  addButtons = (data: exam.IData): [any, boolean] => {
    const goto = (id: number, path: string | null = null) => {
      this.props.select(id);
      if (path)
        this.props.history.push("/" + path)
    }
    let ret = [];
    if (data.rights.update) {
      const btn = <Popup
        key="1"
        trigger={<Button basic icon='edit' onClick={() => { goto(data.id); this.setState({ editing: true }) }} />}
        content={(<FormattedMessage id="label.edit" />)} />
      ret.push(btn);
    }
    if (data.rights.exam_viewuser) {
      const btn = <Popup
        key="3"
        trigger={<Button basic icon='address book' onClick={() => goto(data.id, `exam/${data.id}/user`)} />}
        content={(<FormattedMessage id="nav.exam.user" />)}
      />
      ret.push(btn);
    }
    if (data.rights.exam_viewstudent) {
      const btn = <Popup
        key="4"
        trigger={<Button basic icon='graduation cap' onClick={() => goto(data.id, `exam/${data.id}/student`)} />}
        content={(<FormattedMessage id="nav.exam.student" />)}
      />
      ret.push(btn);
    }
    /*if (data.rights.exam_viewroom) {
      const btn = <Popup
        key="5"
        trigger={<Button basic icon='map marker alternate' onClick={() => goto(data.id, `exam/${data.id}/room`)} />}
        content={(<FormattedMessage id="nav.exam.room" />)}
      />
      ret.push(btn);
    }*/
    if (data.rights.exam_viewlog) {
      const btn = <Popup
        key="6"
        trigger={<Button basic icon='tasks' onClick={() => goto(data.id, `exam/${data.id}/log`)} />}
        content={(<FormattedMessage id="nav.exam.log" />)}
      />
      ret.push(btn);
    }
    if (data.rights.delete) {
      const btn = <Popup
        key="7"
        trigger={<DeleteExamModal key="7" id={data.id} />}
        content={(<FormattedMessage id="nav.exam.log" />)}
      />
      ret.push(btn);
    }
    return [ret, false];
  }
  addHeadButtons = () => {
    let ret = [
      <Button key="1" basic icon="refresh" loading={this.state.loading} onClick={this.refreshTable} />,
    ]

    const _new = this.props.match.params.new;
    !_new ? ret.push(<Button key="2" basic icon="plus" onClick={() => this.props.history.push(this.props.location.pathname + "/add")} />)
      : ret.push(<Button key="3" basic icon="minus" onClick={() => this.props.history.push(this.props.location.pathname.replace("/add", ""))} />);

    return ret;
  }
  public render() {
    const _new = this.props.match.params.new;
    return (
      <Container as="main">
        <ExamForm create={true} hidden={!_new} />
        <Table
          format={{ 1: { collapsing: true } }}
          sortable={{ 'name': true, 'date': true }}
          header={[
            { "k": "name", "t": "label.name" }, { "k": "date", "t": "label.date" },
            { "k": 'btn', 'fn': this.addButtons, "t": this.addHeadButtons() }]}
          data={Object.values(this.props.exams).reduce((acc: any, cur) => { acc[cur.id] = { ...cur, date: getDateTimeString(this.props.intl, cur.date) }; return acc; }, {})}
          filter={{ 'name': true, 'date': true }}
          onSelect={(data: exam.IData) => { this.props.select(data.id) }}
          selectKey={'id'}
          selected={this.props.selected ? [this.props.selected] : undefined}
        />
        {this.props.selected &&
          <Modal
            open={this.state.editing}
            closeIcon={true}
            onClose={() => this.setState({ editing: false })}
          >
            <Modal.Content>
              <ExamForm create={false} onSuccess={() => this.setState({ editing: false })} />
            </Modal.Content>
          </Modal>}
      </Container>
    );
  }
}

interface ReduxProps {
  exams: { [key: number]: exam.IData };
  selected?: number
}
interface ReduxFn {
  load: any;
  select: any;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { selected, ...exams } = state.exams;
  return ({
    exams,
    selected
  })
}
export default connect(mapStateToProps, { load: exam.list, select: exam.select })(injectIntl(withRouter(ExamPage)))