// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FormBase } from './FormBase'
import { connect } from 'react-redux';
import * as examlog from '../../api/api.exam.log';
import * as examstudent from '../../api/api.exam.student';
import { Form, Dropdown } from 'semantic-ui-react';
import { IReduxRootProps } from '../../rootReducer';



export interface IExamLogFormProps {
    add: boolean;
}

export interface IExamLogFormState {
    text: string
    student: number | null
}

class ExamLogForm extends React.Component<IExamLogFormProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamLogFormState> {
    INIT_VALUES: IExamLogFormState = {
        text: "",
        student: null,
    }
    constructor(props: IExamLogFormProps & ReduxFn & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = this.INIT_VALUES;
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ text: e.target.value });
    componentDidMount = () => {
        this.reset();
    }
    componentDidUpdate = (props: ReduxProps) => {
        if (props.log === null && this.props.log === null) return;
        if (props.log === null && this.props.log !== null) return this.reset();
        if (props.log !== null && this.props.log === null) return this.reset();
        // @ts-ignore: user cannot be null here
        if (props.log.id !== this.props.log.id) return this.reset();
    }
    reset = () => {
        if (this.props.add) return
        if (!this.props.log) return this.setState(this.INIT_VALUES);
        this.setState({ text: this.props.log.text, student: this.props.log.student })
    }
    addLog = () => {
        const { examid } = this.props;
        if (!examid) return;
        if (!this.props.add) {
            if (!this.props.log) return;
            return this.props.update(examid, this.props.log.id, this.state.text)
        }
        if (this.state.student)
            return this.props.create2(examid, this.state.student, this.state.text)
        return this.props.create(examid, this.state.text)
    }
    selectStudent = (e: any, { value }: any) => this.setState({ student: typeof (value) === "number" ? value : null })
    public render() {
        const student = this.props.intl.formatMessage({ id: "label.select.student" })
        const text = this.props.intl.formatMessage({ id: "label.text" })
        return (
            <FormBase button={"submit" + (this.props.add ? "" : ".update")+".log"} onSubmit={this.addLog}>
                <Form.Input
                    name="ident"
                    type="text"
                    label={text}
                    placeholder={text}
                    value={this.state.text}
                    onChange={this.onChange}
                />
                <Dropdown
                    disabled={!this.props.add}
                    fluid
                    search
                    placeholder={student}
                    value={this.state.student ? this.state.student : ""}
                    onChange={this.selectStudent}
                    scrolling
                    clearable
                    options={this.props.student.map((val) => ({ key: val.id, value: val.id, text: `${val.name} (${val.ident})` }))}
                    selection
                />
            </FormBase>
        );
    }
}

interface ReduxFn {
    create: any;
    create2: any;
    update: any;
}

interface ReduxProps {
    log: examlog.IData | null;
    examid?: number,
    student: examstudent.IData[]
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { examstudent, examlog, exams } = state;
    const { selected, ..._log } = examlog;
    const log = selected ? _log[selected] : null;
    const { selected: _, ...student } = examstudent;

    return ({
        log,
        examid: exams.selected,
        student: Object.values(student)
    })
}
export default connect(mapStateToProps, { create: examlog.create, create2: examlog.create2, update: examlog.update })(injectIntl(ExamLogForm));

