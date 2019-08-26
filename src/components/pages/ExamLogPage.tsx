import * as React from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import * as examlog from '../../api/api.exam.log';
import * as examuser from '../../api/api.exam.user';
import * as examstudent from '../../api/api.exam.student';
import { Popup, Button, Container } from 'semantic-ui-react';
import ObjectTable from '../table/ObjectTable';
import ExamLogForm from '../forms/ExamLogForm'
import DeleteExamLogModal from '../modal/DeleteExamLogModal';
import Exporter from '../../util/exporter/exporter';
import { getDateTimeString } from '../../util/time';

class Table extends ObjectTable<examlog.IData> { }

export interface IExamLogPageProps {
}

export interface IExamLogPageState {
  loading: boolean;
}

class ExamLogPage extends React.Component<IExamLogPageProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamLogPageState> {
  constructor(props: IExamLogPageProps & ReduxFn & ReduxProps & WrappedComponentProps) {
    super(props);

    this.state = {
      loading: false,
    }
  }
  componentDidMount = () => {
    //| Send Request to Server
    if (Object.keys(this.props.log).length === 0)
      this.refreshTable();
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
    if (exam.rights.exam_updateuser) {
      const btn = <Popup
        key="1"
        trigger={<Button basic icon='edit' onClick={() => goto(data.id)} />}
        content={(<FormattedMessage id="common.button.edit" />)}
      />
      ret.push(btn);
    }
    if (exam.rights.exam_deleteuser) {
      const btn = <Popup
        key="7"
        trigger={<DeleteExamLogModal key="7" exam={exam.id} id={data.id} />}
        content={(<FormattedMessage id="common.button.delete" />)}
      />
      ret.push(btn);
    }
    return [ret, false];
  }
  addStudent = (log: examlog.IData): [any, boolean] => {
    if (!log.student) return [null, true]
    const s = this.props.student[log.student]
    return [`${s.name} (${s.ident})`, true]
  }
  export = () => {
    const _s = this.props.student
    const student = (log: examlog.IData) => !log.student ? "" : `${_s[log.student].name} (${_s[log.student].ident})`;
    const date = (log: examlog.IData) => getDateTimeString(this.props.intl, Date.parse(log.date));
    const ex = new Exporter(Object.values(this.props.log), [
      { k: 'id', t: 'id' },
      { k: 'text', t: 'text' },
      { k: student, t: 'student' },
      { k: date, t: 'date' }
    ])
    //ex.toCSV('log');
    // ex.toXLS('log');
    // ex.toJSON('log');
    ex.toXLSX('log')
  }
  public render() {
    return (
      <Container as="main">
        <Table
          format={{ 1: { collapsing: true } }}
          sortable={{
            name: true, email: true
          }}
          header={[
            { k: "text", t: "common.text" },
            { k: "user", t: "common.user" },
            { k: "date", t: "common.date", fn: (val) => [getDateTimeString(this.props.intl, Date.parse(val.date)), true] },
            { k: "student", t: "common.student", fn: this.addStudent },
            { k: 'btn', fn: this.addButtons, t: <Button basic icon="refresh" loading={this.state.loading} onClick={this.refreshTable} /> }]}
          data={this.props.log}
          filter={{ 'name': true, 'email': true, 'note': true }}
          onSelect={(data: examlog.IData) => { this.props.select(data.id) }}
          selectKey={'id'}
          selected={this.props.selected ? [this.props.selected] : undefined}
        />
        <ExamLogForm add={true} />
        {this.props.selected && <ExamLogForm add={false} />}
        <Button onClick={this.export} />
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
  student: examstudent.IList
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
