// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FormBase } from './FormBase'
import { connect } from 'react-redux';
import * as exam from '../../api/api.exam';
import { Form } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { getDateFormat, getTimeFormat, getDateTimeString, parseDateString } from '../../util/time';
import { IReduxRootProps } from '../../rootReducer';


export interface IExamFormProps {
    create: boolean;
    hidden?: boolean;
    onSuccess?: () => any
}

export interface IExamFormState {
    data: exam.IUpdateExamData;
}

type TExamProps = IExamFormProps & ReduxFn & WrappedComponentProps & ReduxProps

class ExamForm extends React.Component<TExamProps, IExamFormState> {
    INIT_VALUES: IExamFormState = {
        data: {
            name: "",
            date: Date.now(),
        }
    }
    state = this.INIT_VALUES;
    componentDidMount = () => {
        this.reset();
    }
    componentDidUpdate = (prevProps: TExamProps) => {
        const oldExam = prevProps.exam;
        const currentExam = this.props.exam;
        if (oldExam === null && currentExam === null) return;
        if (oldExam !== null && currentExam !== null && oldExam.id === currentExam.id) return;
        this.reset();

    }
    reset = () => {
        const { exam, create } = this.props;
        if (exam && !create) {
            this.setState({ data: { name: exam.name, date: exam.date } })
        } else {
            this.setState(this.INIT_VALUES)
        }
    }
    asyncFn = (data: any) => {
        if (data !== true) return;
        if (this.props.create) {
            this.setState({ data: { name: "", date: Date.now() } })
        }
        if (this.props.onSuccess) {
            this.props.onSuccess();
        }
    }
    send = (): Promise<any> => {
        const { exam, create, updateExam, createExam } = this.props;
        if (create)
            return new Promise((res) => createExam(this.state.data).then((data: any) => { this.asyncFn(data); res(data) }))
        //@ts-ignore
        return new Promise((res) => updateExam(exam.id, this.state.data).then((data: any) => { this.asyncFn(data); res(data) }))
    }

    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onChangeDate = (e: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
        this.setState({ data: { ...this.state.data, [data.name]: parseDateString(this.props.intl, data.value) } })
    }
    public render() {
        if (this.props.hidden) {
            return null
        }
        const name = this.props.intl.formatMessage({ id: "label.name" })
        const date = this.props.intl.formatMessage({ id: "label.date" })
        const { data } = this.state;
        return (
            <FormBase button={this.props.create ? "submit.exam" : "submit.update.exam"} onSubmit={this.send}>
                <Form.Input
                    name="name"
                    type="text"
                    label={name}
                    placeholder={name}
                    value={data.name ? data.name : ""}
                    onChange={this.onChange}
                    required
                />
                <DateTimeInput
                    required
                    name="date"
                    label={date}
                    placeholder={date}
                    duration={0}
                    closable={true}
                    value={getDateTimeString(this.props.intl, data.date)}
                    onChange={this.onChangeDate}
                    dateFormat={getDateFormat(this.props.intl)}
                    timeFormat={getTimeFormat(this.props.intl)}
                    preserveViewMode={false}
                    localization={this.props.intl.locale}
                />
            </FormBase>)
    }
}
interface ReduxFn {
    updateExam: any;
    createExam: any
}

interface ReduxProps {
    exam: exam.IData | null,
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { exams } = state;
    const { selected, ...data } = exams;

    return ({
        exam: selected ? data[selected] : null
    })
}
export default connect(mapStateToProps, { updateExam: exam.update, createExam: exam.create })(injectIntl(ExamForm));
