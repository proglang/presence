// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Container, Form, DropdownProps } from 'semantic-ui-react';
import { IReduxRootProps } from '../../rootReducer';
import * as user from '../../api/api.user';
import * as exam from '../../api/api.exam';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { setTitle } from '../../util/helper';
import { FormBase } from '../forms/FormBase';
import Exporter, { ISheet } from '../../util/exporter/exporter';
import { getDateTimeString } from '../../util/time';
import * as examlog from '../../api/api.exam.log';
import * as examstudent from '../../api/api.exam.student';

export interface IUserPageProps {
}

export interface IUserPageState {
    data: string[],
    format: string
}

class UserPage extends React.Component<IUserPageProps & ReduxProps & ReduxFn & WrappedComponentProps, IUserPageState> {
    constructor(props: IUserPageProps & ReduxProps & ReduxFn & WrappedComponentProps) {
        super(props);

        this.state = {
            data: ['student', 'log'],
            format: 'xlsx',
        }
    }
    componentDidMount = () => {
        setTitle(this.props.intl.formatMessage({ id: "page.user" }))
    }

    formats = [
        { key: "csv", value: "csv", text: "label.export.csv" },
        { key: "xls", value: "xls", text: "label.export.xls" },
        { key: "xlsx", value: "xlsx", text: "label.export.xlsx" },
    ];
    data = [
        { key: "student", value: "student", text: "label.export.student" },
        { key: "log", value: "log", text: "label.export.log" },
    ]
    onChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const { name, value } = data;
        //@ts-ignore
        this.setState({ [name]: value });
    }

    export = () => {
        return this.props.reload(this.props.examid).then(() => {

            const { data, format } = this.state
            const sheets = data.reduce((prev: ISheet[], cur): ISheet[] => {
                prev.push(cur === 'student' ? this.ExportStudent() : this.ExportLog());
                return prev
            }, [])
            const name = this.props.exam.name + "_log_" + String(Date.now());
            switch (format) {
                case 'xlsx':
                    Exporter.toXLSX(name, ...sheets);
                    break;
                case 'xls':
                    Exporter.toXLSX(name, ...sheets);
                    break;
                case 'csv':
                    sheets.forEach((data, index) => {
                        Exporter.toCSV(name + "_" + String(index), data);
                    })
                    break;
            }
        });
    }
    ExportStudent = () => {
        const present = (log: examstudent.IData) => log.present ? "y" : "n";
        const ex = new Exporter(Object.values(this.props.student), [
            { k: 'id', t: 'id' },
            { k: 'ident', t: 'ident' },
            { k: 'name', t: 'name' },
            { k: present, t: 'present' },
        ])
        return ex.toSheet('student')
    }
    ExportLog = () => {
        const _s = this.props.student
        const student = (log: examlog.IData) => !log.student ? "" : `${_s[log.student].name} (${_s[log.student].ident})`;
        const date = (log: examlog.IData) => getDateTimeString(this.props.intl, log.date);
        const ex = new Exporter(Object.values(this.props.log), [
            { k: 'id', t: 'id' },
            { k: 'text', t: 'text' },
            { k: student, t: 'student' },
            { k: date, t: 'date' }
        ])
        return ex.toSheet('log')
    }
    public render() {
        return (
            <Container as="main">
                <FormBase button={"submit.export"} onSubmit={this.export}>
                    <Form.Dropdown
                        name={"format"}
                        placeholder={"label.export.format"}
                        selection
                        options={this.formats.map((data) => ({...data, text: this.props.intl.formatMessage({ id: data.text }) }))}
                        onChange={this.onChange}
                        value={this.state.format}
                    />
                    <Form.Dropdown
                        name={"data"}
                        selection
                        placeholder={"label.export.data"}
                        onChange={this.onChange}
                        multiple
                        options={this.data.map((data) => ({...data, text: this.props.intl.formatMessage({ id: data.text }) }))}
                        value={this.state.data}
                    />
                </FormBase>
            </Container>
        );
    }
}

interface ReduxProps {
    user: user.IUserData;
    examid: number;

    student: { [key: number]: examstudent.IData }
    log: { [key: number]: examlog.IData };
    exam: exam.IData;
}
interface ReduxFn {
    delete: any;
    reload: any;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {

    const { examlog, user, examstudent } = state;
    const { selected, ...exams } = state.exams;
    const { selected: userid, ...log } = examlog;
    const { selected: _, ...student } = examstudent;
    return ({
        //@ts-ignore
        exam: exams[selected],
        log,
        student,
        //@ts-ignore
        examid: state.exams.selected,
        //@ts-ignore
        user: user

    })
}
export default connect(mapStateToProps, { delete: user.del, reload: exam.reload })(injectIntl(UserPage))