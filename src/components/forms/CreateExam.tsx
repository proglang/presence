// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent } from 'react';
import {  injectIntl, WrappedComponentProps } from 'react-intl';
import { FormBase } from './FormBase'
import { connect } from 'react-redux';
import * as exam from '../../api/api.exam';
import { Form } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { getDateFormat, getTimeFormat, getDateTimeString, parseDateString } from '../../util/time';
import * as validate from '../../validator/validator';


export interface ICreateExamFormProps {
}

export interface ICreateExamFormState {
    data: exam.IUpdateExamData;
}

class CreateExamForm extends React.Component<ICreateExamFormProps  & ReduxFn & WrappedComponentProps, ICreateExamFormState> {
    constructor(props: ICreateExamFormProps  & ReduxFn & WrappedComponentProps) {
        super(props);
        this.state = {
            data: {
                name: "",
                date: Date.now(),
            }
        }
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onChangeDate = (e: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
        this.setState({ data: { ...this.state.data, [data.name]: parseDateString(this.props.intl, data.value) } })
    }
    public render() {
        const name = this.props.intl.formatMessage({ id: "label.name" })
        const date = this.props.intl.formatMessage({ id: "label.date" })
        const { data } = this.state;
        return (
            <FormBase button="submit.exam" onSubmit={() => this.props.create(this.state.data)}>
                <Form.Input
                    name="name"
                    type="text"
                    label={name}
                    placeholder={name}
                    value={data.name}
                    onChange={this.onChange}
                    validator={() => validate.exam_name(data.name)}
                />
                <DateTimeInput
                    name="date"
                    label={date}
                    placeholder={date}
                    duration={0}
                    value={getDateTimeString(this.props.intl, data.date)}
                    onChange={this.onChangeDate}
                    dateFormat={getDateFormat(this.props.intl)}
                    timeFormat={getTimeFormat(this.props.intl)}
                    preserveViewMode={false}
                    validator={() => validate.date(data.date)}
                    localization={this.props.intl.locale}
                />
            </FormBase>)
    }
}

interface ReduxFn {
    create: any;
}
export default connect(null, { create: exam.create })(injectIntl(CreateExamForm));
