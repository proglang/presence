// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import * as examuser from '../../api/api.exam.user';
import { Popup, Button, Container, Icon, SemanticICONS } from 'semantic-ui-react';
import ObjectTable from '../table/ObjectTable';
import ExamUserForm from '../forms/ExamUserForm'
import DeleteExamUserModal from '../modal/DeleteExamUserModal';

class Table extends ObjectTable<examuser.IData> { }

export interface IExamUserPageProps {
}

export interface IExamUserPageState {
  loading: boolean;
}

class ExamUserPage extends React.Component<IExamUserPageProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamUserPageState> {
  constructor(props: IExamUserPageProps & ReduxFn & ReduxProps & WrappedComponentProps) {
    super(props);

    this.state = {
      loading: false,
    }
  }
  componentDidMount = () => {
    //| Send Request to Server
    if (Object.keys(this.props.user).length === 0)
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

  addButtons = (data: examuser.IData): [any, boolean] => {
    const goto = (id: number) => {
      this.props.select(id);
    }
    // you cannot edit yourself!
    if (data.id === this.props.self) return [[], false];
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
        trigger={<DeleteExamUserModal key="7" exam={exam.id} id={data.id} />}
        content={(<FormattedMessage id="common.button.delete" />)}
      />
      ret.push(btn);
    }
    return [ret, false];
  }
  addRights = (data: examuser.IData): [any, boolean] => {
    const urights: any = data.rights;
    const ret = Object.entries(examuser.rightIcons).map((cur: [string, SemanticICONS], index: number) => {
      if (!urights[cur[0]]) return null;
      return <Popup
        position="top center"
        key={index}
        trigger={<Icon color={examuser.getRightColor(cur[0])} style={{ margin: 0, fontSize: "1.4em" }} size='small' name={cur[1]} />}
        content={(<FormattedMessage id={"user.right." + cur[0]} />)}
      />
    }
    )
    ret.splice(11, 0, <br key="lb" />);
    return [ret, true];
  }
  public render() {
    return (
      <Container as="main">
        <Table
          format={{ 1: { collapsing: true } }}
          sortable={{
            name: true, email: true, rights: (a: examuser.IData, b: examuser.IData) => {
              return Object.values(a.rights).filter((val) => val === true).length < Object.values(b.rights).filter((val) => val === true).length;
            }
          }}
          header={[
            { k: "name", t: "common.name" }, { k: "email", t: "common.email" }, { k: "note", t: "common.note" },
            { k: 'rights', fn: this.addRights, t: "common.rights" },
            { k: 'btn', fn: this.addButtons, t: <Button basic icon="refresh" loading={this.state.loading} onClick={this.refreshTable} /> }]}
          data={this.props.user}
          filter={{ 'name': true, 'email': true, 'note': true }}
          onSelect={(data: examuser.IData) => { this.props.select(data.id) }}
          selectKey={'id'}
          selected={this.props.selected ? [this.props.selected] : undefined}
        />
        <ExamUserForm add={true} />
        {this.props.selected && <ExamUserForm add={false} />}
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
  user: { [key: number]: examuser.IData };
  selected?: number
  exam?: { id: number, rights: examuser.TRights }
  self: number | null
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
  const { examuser, exams: examlist, user: self } = state;
  const { selected: userid, ...user } = examuser;
  const { selected: examid, ...exams } = examlist;


  return ({
    user,
    selected: userid,
    exam: examid ? { id: examid, rights: exams[examid].rights } : undefined,
    self: self ? self.id : null
  })
}
export default connect(mapStateToProps, { load: examuser.list, reset: examuser.reset, select: examuser.select })(injectIntl(ExamUserPage))
