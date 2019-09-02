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

import ObjectTable, { IObjectTableHeader } from '../table/ObjectTable';
import { Popup, Button, Container, Checkbox, Responsive, Modal } from 'semantic-ui-react';
import ExamStudentForm from '../forms/ExamStudentForm';
import DeleteExamStudentModal from '../modal/DeleteExamStudentModal';
import AddStudentListForm from '../forms/AddStudentListForm';
import Exporter from '../../util/exporter/exporter';
import { RouteComponentProps } from 'react-router';
class Table extends ObjectTable<examstudent.IData> { }

export interface IExamStudentPageProps {
}

export interface IExamStudentPageState {
    loading: boolean;
    updatePresence: { [key: number]: boolean }
    currentWidth: number
    editing: boolean
}

export interface IRouterParams {
    new: any;
}

class ExamStudentPage extends React.Component<IExamStudentPageProps & ReduxFn & ReduxProps & WrappedComponentProps & RouteComponentProps<IRouterParams>, IExamStudentPageState> {
    constructor(props: IExamStudentPageProps & ReduxFn & ReduxProps & WrappedComponentProps & RouteComponentProps<IRouterParams>) {
        super(props);
        this.state = {
            loading: false,
            updatePresence: {},
            currentWidth: 0,
            editing: false
        }
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
                trigger={<Button basic icon='edit' onClick={() => { goto(data.id); this.setState({ editing: true }) }} />}
                content={(<FormattedMessage id="label.edit" />)}
            />
            ret.push(btn);
        }
        if (exam.rights.exam_deletestudent) {
            const btn = <Popup
                key="7"
                trigger={<DeleteExamStudentModal key="7" exam={exam.id} id={data.id} />}
                content={(<FormattedMessage id="label.delete" />)}
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

        const onclick = (path?: string) => {
            let current = this.props.location.pathname;
            if (_new)
                current = current.replace("/" + _new, "")
            this.props.history.push((current + "/" + (path ? path : "")).replace("//", "/"))
        }
        if (_new !== "add") {
            ret.push(<Button key="2" basic icon="plus" onClick={() => onclick("add")} />)
        } else {
            ret.push(<Button key="2" basic icon="minus" onClick={() => onclick()} />);
        }
        if (_new !== "list") {
            ret.push(<Button key="3" basic icon="list" onClick={() => onclick("list")} />)
        } else {
            ret.push(<Button key="3" basic icon="minus" onClick={() => onclick()} />);
        }
        return ret;
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
            content={(<FormattedMessage id="label.presence.set" />)}
        />
        return [ret, false];
    }

    export = () => {
        const present = (log: examstudent.IData) => log.present ? "y" : "n";
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
        //@ts-ignore
        const mobile = Responsive.onlyComputer.minWidth > this.state.currentWidth;
        const { updatePresence } = this.state

        const header: IObjectTableHeader<examstudent.IData>[] = [
            { k: "present", t: "label.present", fn: this.addPresence },
            { k: "ident", t: "label.ident" },
            { k: "name", t: "label.name" },
        ]
        if (!mobile) {
            header.push({ k: 'btn', fn: this.addButtons, t: this.addHeadButtons() })
        }
        // <Button onClick={this.export} content={'export'} />
        return (
            <Container as="main">
                {this.props.match.params.new === "list" && <AddStudentListForm />}
                {this.props.match.params.new === "add" && <ExamStudentForm add={true} />}

                <Responsive key="1" fireOnMount onUpdate={(_, data: any) => this.setState({ currentWidth: data.width })} />
                <Table
                    format={{ 1: { collapsing: true } }}
                    sortable={{
                        name: true, ident: true
                    }}
                    colPropFn={
                        (d: examstudent.IData, col: any) =>
                            col !== 'present' ? null : { style: { backgroundColor: updatePresence[d.id] ? 'yellow' : d.present ? 'green' : 'red' }, onClick: () => this.setPresence(d.id, !d.present) }
                    }
                    header={header}
                    data={this.props.student}
                    filter={{ 'name': true, 'ident': true }}
                    onSelect={(data: examstudent.IData) => { this.props.select(data.id) }}

                    selectKey={'id'}
                    selected={this.props.selected ? [this.props.selected] : undefined}
                />
                <Modal
                    open={!!(this.props.selected && this.state.editing)}
                    closeIcon={true}
                    onClose={() => this.setState({ editing: false })}
                >
                    <Modal.Content>
                        <ExamStudentForm add={false} onSuccess={() => this.setState({ editing: false })}/>
                    </Modal.Content>
                </Modal>
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
