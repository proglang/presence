
import * as React from 'react';
import { connect } from 'react-redux';
import * as exam from '../../api/api.exam';
import { IReduxRootProps } from '../../rootReducer';
import { Container, Popup, Button } from 'semantic-ui-react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import ObjectTable from '../table/ObjectTable';
import { withRouter, RouteComponentProps } from 'react-router';
import EditExam from '../forms/EditExam';
import { getDateTimeString } from '../../util/time';
import CreateExam from '../forms/CreateExam';

class Table extends ObjectTable<exam.IExamData> { }



export interface IExamPageProps {
}

export interface IExamPageState {
}

class ExamPage extends React.Component<IExamPageProps & ReduxProps & ReduxFn & WrappedComponentProps & RouteComponentProps<{}>, IExamPageState> {
  constructor(props: IExamPageProps & ReduxProps & ReduxFn & WrappedComponentProps & RouteComponentProps<{}>) {
    super(props);
    this.state = {
    }
  }
  componentDidMount = () => {
    //| Send Request to Server
    this.props.load()
  }
  getTable = () => {
    return Object.values(this.props.exams).map((value: any) => [value.name, value.date,
    <Popup key="1" trigger={<Button basic icon='edit' onClick={this.props.select} />} content={(<FormattedMessage id="common.button.select" />)} />]);
  }
  addButtons = (data: exam.IExamData) => {
    const goto = (id: number, path: string | null = null) => {
      this.props.select(id);
      if (path)
        this.props.history.push("/" + path)
    }
    let ret = [];
    if (data.rights.update) {
      const btn = <Popup
        key="1"
        trigger={<Button basic icon='edit' onClick={() => goto(data.id)} />}
        content={(<FormattedMessage id="common.button.edit" />)} />
      ret.push(btn);
    }
    if (data.rights.exam_viewuser) {
      const btn = <Popup
        key="3"
        trigger={<Button basic icon='address book' onClick={() => goto(data.id, "exam/user")} />}
        content={(<FormattedMessage id="nav.exam.user" />)}
      />
      ret.push(btn);
    }
    if (data.rights.exam_viewstudent) {
      const btn = <Popup
        key="4"
        trigger={<Button basic icon='graduation cap' onClick={() => goto(data.id, "exam/student")} />}
        content={(<FormattedMessage id="nav.exam.student" />)}
      />
      ret.push(btn);
    }
    if (data.rights.exam_viewroom) {
      const btn = <Popup
        key="5"
        trigger={<Button basic icon='map marker alternate' onClick={() => goto(data.id, "exam/room")} />}
        content={(<FormattedMessage id="nav.exam.room" />)}
      />
      ret.push(btn);
    }
    if (data.rights.exam_viewlog) {
      const btn = <Popup
        key="6"
        trigger={<Button basic icon='tasks' onClick={() => goto(data.id, "exam/log")} />}
        content={(<FormattedMessage id="nav.exam.log" />)}
      />
      ret.push(btn);
    }
    return ret;
    //return Object.entries(data.rights).map((value) => <p>{value[0]}{value[1] ? 1 : 0}</p>)
  }
  public render() {
    return (
      <Container as="main">
        <Table
          format={{ 1: { collapsing: true } }}
          sortable={{ 'name': true, 'date': true }}
          header={[{ "k": "name", "t": "common.name" }, { "k": "date", "t": "common.date" }, { "k": this.addButtons, "t": "test" }]}
          data={Object.values(this.props.exams).reduce((acc: any, cur) => { acc[cur.id] = { ...cur, date: getDateTimeString(this.props.intl, cur.date) }; return acc; }, {})}
          filter={{ 'name': true, 'date': true }}
          onSelect={(data: exam.IExamData) => { this.props.select(data.id) }}
          selectKey={'id'}
          selected={this.props.selected ? [this.props.selected] : undefined}
        />
        {this.props.selected && <EditExam exam={this.props.exams[this.props.selected]} />}
        {<CreateExam />}
      </Container>
    );
  }
}

interface ReduxProps {
  exams: { [key: number]: exam.IExamData };
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