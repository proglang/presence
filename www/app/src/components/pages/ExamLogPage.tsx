// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import * as examlog from '../../api/api.exam.log';
import * as examuser from '../../api/api.exam.user';
import * as examstudent from '../../api/api.exam.student';
import { Popup, Button, Container, Modal } from 'semantic-ui-react';
import ObjectTable from '../table/ObjectTable';
import ExamLogForm from '../forms/ExamLogForm'
import DeleteExamLogModal from '../modal/DeleteExamLogModal';
import { getDateTimeString } from '../../util/time';
import { setTitle } from '../../util/helper';

class Table extends ObjectTable<examlog.IData> { }

export interface IExamLogPageProps {
}

export interface IExamLogPageState {
  loading: boolean;
  editing: boolean;
}

class ExamLogPage extends React.Component<IExamLogPageProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamLogPageState> {
  constructor(props: IExamLogPageProps & ReduxFn & ReduxProps & WrappedComponentProps) {
    super(props);

    this.state = {
      loading: false,
      editing: false
    }
  }
  componentDidMount = () => {
    setTitle(this.props.intl.formatMessage({ id: "page.exam.log" }))
  }
  refreshTable = () => {
    if (!this.props.exam) {
      return;
    }
    if (this.state.loading) return;
    this.setState({ loading: true });
    this.props.load(this.props.exam.id).then(() => this.setState({ loading: false })).catch(() => this.setState({ loading: false }))
  }

  addButtons = (data: examlog.IData): [any, boolean] => {
    const goto = (id: number) => {
      this.props.select(id);
    }
    const { exam } = this.props
    if (!exam) return [[], false]
    let ret = [];
    if (exam.rights.exam_updatelog) {
      const btn = <Popup
        key="1"
        trigger={<Button basic icon='edit' onClick={() => { goto(data.id); this.setState({ editing: true }) }} />}
        content={(<FormattedMessage id="label.edit" />)}
      />
      ret.push(btn);
    }
    if (exam.rights.exam_deletelog) {
      const btn = <Popup
        key="7"
        trigger={<DeleteExamLogModal key="7" exam={exam.id} id={data.id} />}
        content={(<FormattedMessage id="label.delete" />)}
      />
      ret.push(btn);
    }
    return [ret, false];
  }
  addStudent = (log: examlog.IData): [any, boolean] => {
    if (!log.student) return [null, true]
    const s = this.props.student[log.student]
    if (!s) return [null, true];
    return [`${s.name} (${s.ident})`, true]
  }
  public render() {
    return (
      <Container as="main">
        <Table
          format={{ 1: { collapsing: true } }}
          sortable={{
            text: true, user: true, date: true, student: true
          }}
          header={[
            {
              k: "text", t: "label.text", fn: ((data) =>
                [data.text.split("\n").map((val, index) =>
                  [index > 0 ? <br key={-index} /> : null, <i style={{ fontStyle: "normal" }} key={index}>{val}</i>]), true])
            },
            { k: "student", t: "label.student", fn: this.addStudent },
            { k: "date", t: "label.date", fn: (val) => [getDateTimeString(this.props.intl, val.date), true] },
            { k: "user", t: "label.user" },
            { k: 'btn', fn: this.addButtons, t: <Button basic icon="refresh" loading={this.state.loading} onClick={this.refreshTable} /> }]}
          data={this.props.log}
          filter={{ 'text': true, 'user': true, 'date': true, 'student': true }}
          onSelect={(data: examlog.IData) => { this.props.select(data.id) }}
          selectKey={'id'}
          selected={this.props.selected ? [this.props.selected] : undefined}
        />
        <ExamLogForm add={true} />

        <Modal
            open={!!(this.props.selected && this.state.editing)}
            closeIcon={true}
            onClose={() => this.setState({ editing: false })}
        >
            <Modal.Content>
                <ExamLogForm add={false} onSuccess={() => this.setState({ editing: false })}/>
            </Modal.Content>
        </Modal>
      </Container>
    );
  }
}

interface ReduxFn {
  load: any;
  select: any;
  reset: any;
}
interface ReduxProps {
  log: { [key: number]: examlog.IData };
  selected?: number
  exam?: { id: number, rights: examuser.TRights }
  self: number | null
  student: { [key: number]: examstudent.IData }
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { examlog, exams: examlist, user: self, examstudent } = state;
  const { selected: userid, ...log } = examlog;
  const { selected: examid, ...exams } = examlist;
  const { selected: _, ...student } = examstudent;


  return ({
    log,
    selected: userid,
    exam: examid ? { id: examid, rights: exams[examid].rights } : undefined,
    self: self ? self.id : null,
    student
  })
}
export default connect(mapStateToProps, { load: examlog.list, reset: examlog.reset, select: examlog.select })(injectIntl(ExamLogPage))
