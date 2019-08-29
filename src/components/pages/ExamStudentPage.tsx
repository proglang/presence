// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as examstudent from '../../api/api.exam.student';
import * as examuser from '../../api/api.exam.user';

import ObjectTable from '../table/ObjectTable';
import { Popup, Button, Container, Checkbox } from 'semantic-ui-react';
import ExamStudentForm from '../forms/ExamStudentForm';
import DeleteExamStudentModal from '../modal/DeleteExamStudentModal';
import AddStudentListForm from '../forms/AddStudentListForm';
import Exporter from '../../util/exporter/exporter';
class Table extends ObjectTable<examstudent.IData> { }

export interface IExamStudentPageProps {
}

export interface IExamStudentPageState {
    loading: boolean;
    updatePresence: { [key: number]: boolean }
}

class ExamStudentPage extends React.Component<IExamStudentPageProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamStudentPageState> {
    constructor(props: IExamStudentPageProps & ReduxFn & ReduxProps & WrappedComponentProps) {
        super(props);
        this.state = {
            loading: false,
            updatePresence: {}
        }
    }

    componentDidMount = () => {
        //| Send Request to Server
        if (Object.keys(this.props.student).length === 0)
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
    setPresence = (student_id: number, presence: boolean) => {
        const { exam } = this.props;
        if (!exam) {
            return;
        }
        if (!exam.rights.exam_updatestudent_presence) return;
        if (this.state.updatePresence[student_id]) return;

        this.setState({ updatePresence: { ...this.state.updatePresence, [student_id]: true } });
        this.props.setPresence(exam.id, student_id, presence)
            .then(() => this.setState({ updatePresence: { ...this.state.updatePresence, [student_id]: false } }))
            .catch(() => this.setState({ updatePresence: { ...this.state.updatePresence, [student_id]: false } }))
    }

    addButtons = (data: examstudent.IData): [any, boolean] => {
        const goto = (id: number) => {
            this.props.select(id);
        }
        const { exam } = this.props
        if (!exam) return [[], false]
        let ret = [];
        if (exam.rights.exam_updatestudent) {
            const btn = <Popup
                key="1"
                trigger={<Button basic icon='edit' onClick={() => goto(data.id)} />}
                content={(<FormattedMessage id="common.button.edit" />)}
            />
            ret.push(btn);
        }
        if (exam.rights.exam_deletestudent) {
            const btn = <Popup
                key="7"
                trigger={<DeleteExamStudentModal key="7" exam={exam.id} id={data.id} />}
                content={(<FormattedMessage id="common.button.delete" />)}
            />
            ret.push(btn);
        }
        return [ret, false];
    }
    addPresence = (data: examstudent.IData): [any, boolean] => {
        const { exam } = this.props
        if (!exam) return [[], false]
        const setPresence = !!exam.rights.exam_updatestudent_presence;
        const ret = <Popup
            key="7"
            trigger={
                <Checkbox
                    key="7"
                    checked={data.present}
                    indeterminate={this.state.updatePresence[data.id]}
                    disabled={!setPresence}
                    onClick={() => this.setPresence(data.id, !data.present)}
                />
            }
            content={(<FormattedMessage id="common.button.delete" />)}
        />
        return [ret, false];
    }

  export = () => {
    const present = (log: examstudent.IData) => log.present?"y":"n";
    const ex = new Exporter(Object.values(this.props.student), [
      { k: 'id', t: 'id' },
      { k: 'ident', t: 'ident' },
      { k: 'name', t: 'name' },
      { k: present, t: 'present' },
    ])
    //ex.toCSV('log');
    // ex.toXLS('log');
    // ex.toJSON('log');
    ex.toXLSX('student')
  }
    public render() {
        const { updatePresence } = this.state
        return (
            <Container as="main">
                <Table
                    format={{ 1: { collapsing: true } }}
                    sortable={{
                        name: true, ident: true
                    }}
                    colPropFn={
                        (d: examstudent.IData, col: any) =>
                            col !== 'present' ? null : { style: { backgroundColor: updatePresence[d.id] ? 'yellow' : d.present ? 'green' : 'red' },onClick: ()=>this.setPresence(d.id, !d.present) }
                    }
                    header={[
                        { k: "present", t: "common.present", fn: this.addPresence },
                        { k: "ident", t: "common.ident" },
                        { k: "name", t: "common.name" },
                        { k: 'btn', fn: this.addButtons, t: <Button basic icon="refresh" loading={this.state.loading} onClick={this.refreshTable} /> }]}
                    data={this.props.student}
                    filter={{ 'name': true, 'ident': true }}
                    onSelect={(data: examstudent.IData) => { this.props.select(data.id) }}
                    
                    selectKey={'id'}
                    selected={this.props.selected ? [this.props.selected] : undefined}
                />
                <AddStudentListForm />
                <ExamStudentForm add={true} />
                {this.props.selected && <ExamStudentForm add={false} />}
                <Button onClick={this.export} content={'export'} />
            </Container>
        );
    }
}

interface ReduxFn {
    select: any;
    load: any;
    setPresence: any;
}
interface ReduxProps {
    student: { [key: number]: examstudent.IData };
    selected?: number
    exam?: { id: number, rights: examuser.TRights }
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { examstudent, exams: examlist } = state;
    const { selected: studentid, ...student } = examstudent;
    const { selected: examid, ...exams } = examlist;

    return ({
        student,
        selected: studentid,
        exam: examid ? { id: examid, rights: exams[examid].rights } : undefined,
    })
}
export default connect(mapStateToProps, { load: examstudent.list, select: examstudent.select, setPresence: examstudent.setPresence })(injectIntl(ExamStudentPage))
