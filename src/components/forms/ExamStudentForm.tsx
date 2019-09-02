// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent, SyntheticEvent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FormBase } from './FormBase'
import { connect } from 'react-redux';
import * as examstudent from '../../api/api.exam.student';
import { Form } from 'semantic-ui-react';
import { IReduxRootProps } from '../../rootReducer';



export interface IExamStudentFormProps {
    add: boolean;
    onSuccess?: () => any
}

export interface IExamStudentFormState {
    data: examstudent.IData
}

class ExamStudentForm extends React.Component<IExamStudentFormProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamStudentFormState> {
    INIT_VALUES: IExamStudentFormState = {
        data: {
            name: "",
            ident: "",
            id: -1,
            present: false
        },
    }
    constructor(props: IExamStudentFormProps & ReduxFn & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = this.INIT_VALUES;
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onChangeCB = (event: SyntheticEvent, data: any) => this.setState({ data: { ...this.state.data, [data.name]: data.checked } });
    componentDidMount = () => {
        this.reset();
    }
    componentDidUpdate = (props: ReduxProps) => {
        if (props.student === null && this.props.student === null) return;
        if (props.student === null && this.props.student !== null) return this.reset();
        if (props.student !== null && this.props.student === null) return this.reset();
        // @ts-ignore: user cannot be null here
        if (props.student.id !== this.props.student.id) return this.reset();
    }
    reset = () => {
        if (this.props.add) return
        if (!this.props.student) return this.setState(this.INIT_VALUES);
        this.setState({ data: this.props.student })
    }

    asyncFn = (data: any) => {
        if (this.props.onSuccess) {
            this.props.onSuccess();
        }
        //Todo: Error Handling
        console.log(data)
    }
    addUser = () => {
        const { examid } = this.props;
        if (!examid) return;
        // Todo: error Handling
        if (this.props.add)
            return this.props.create(examid, this.state.data).then((data: any) => this.asyncFn(data))
        return this.props.update(examid, this.state.data.id, this.state.data).then((data: any) => this.asyncFn(data))
    }
    public render() {
        const name = this.props.intl.formatMessage({ id: "label.name" })
        const ident = this.props.intl.formatMessage({ id: "label.ident" })
        const { data } = this.state;
        return (
            <FormBase button={"submit" + (this.props.add ? "" : ".update") + ".student"} onSubmit={this.addUser}>
                <Form.Input
                    name="ident"
                    type="text"
                    label={ident}
                    placeholder={ident}
                    value={data.ident}
                    onChange={this.onChange}
                />
                <Form.Input
                    name="name"
                    type="text"
                    label={name}
                    placeholder={name}
                    value={data.name}
                    onChange={this.onChange}
                />
            </FormBase>
        );
    }
}

interface ReduxFn {
    create: any;
    update: any;
}

interface ReduxProps {
    student: examstudent.IData | null;
    examid?: number
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected, ..._student } = state.examstudent;
    const student = selected ? _student[selected] : null;
    const { selected: examid } = state.exams;
    return ({
        student,
        examid
    })
}
export default connect(mapStateToProps, { create: examstudent.create, update: examstudent.update })(injectIntl(ExamStudentForm));

