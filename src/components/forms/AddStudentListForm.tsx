// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import _Dropzone from '../table/Dropzone';
import * as examstudent from '../../api/api.exam.student';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { IReduxRootProps } from '../../rootReducer';
import ObjectTable from '../table/ObjectTable';
import { Button, Segment } from 'semantic-ui-react';
import { IError } from '../../api/api';

class Dropzone extends _Dropzone<examstudent.ICreateData> { };
export interface IAddStudentListFormProps {
}

type TCreateFormData = examstudent.ICreateData & { error: IError | null }
export interface IAddStudentListFormState {
    error: string | null;
    data: TCreateFormData[]
    loading: boolean
}

class AddStudentListForm extends React.Component<IAddStudentListFormProps & ReduxProps & ReduxFn & WrappedComponentProps, IAddStudentListFormState> {
    INITIAL_STATE: IAddStudentListFormState = {
        error: null,
        data: [],
        loading: false
    }
    constructor(props: IAddStudentListFormProps & ReduxProps & ReduxFn & WrappedComponentProps) {
        super(props);

        this.state = this.INITIAL_STATE
    }
    reset = () => {
        this.setState(this.INITIAL_STATE)
    }
    setList = (val: examstudent.ICreateData[] | null) => {
        if (val === null) {
            return this.setState({ data: [], error: "no data!" })
        }

        this.setState({
            error: null,
            data: val.map((data) => ({ error: null, ...data }))
        });

    }
    checkListEntry = (index: number, ret: IError | true) => {
        const { data } = this.state;
        if (ret === true) {
            data[index].error = null
            this.setState({ data })
        } else {
            data[index].error = ret
            this.setState({ data })
        }
    }
    checkListEnd = () => {
        this.setState({ loading: false })
        const { data } = this.state;
        const newdata = data.filter((data) => data.error !== null)
        this.setState({ data: newdata })
    }
    sendList = () => {
        const { create, examid } = this.props
        if (!examid) return;
        this.setState({ loading: true })
        const promises = this.state.data.map((data, index) => {
            return create(examid, data).then((ret: any) => this.checkListEntry(index, ret));
        })
        Promise.all(promises).then(this.checkListEnd)
    }
    rowPropFn = (data: TCreateFormData) => {
        if (data.error === null) return null;
        return { error: true };
    }
    errorCol = (data: TCreateFormData): [any, boolean] => {
        if (data.error === null) return ["", true];
        const { validation } = data.error;
        const ret: any[] = []

        if (validation) {
            validation.getFields().forEach((name) => {
                validation.getMessages(name).forEach((msg, index) =>
                    ret.push(<p key={name + String(index)}><FormattedMessage id={msg.id} values={msg.args} /></p>)
                )
            })
        }
        return [ret, true];
    }
    public render() {
        const { data } = this.state
        console.log(data)
        if (data.length === 0)
            return <Segment basic>
                <Dropzone
                    callback={this.setList}
                    head={[{ key: 'ident', index: 1, fn: (val) => String(val) }, { key: 'name', index: 0 }]}
                    startRow={5}
                />
            </Segment >
        return (
            <Segment loading={this.state.loading} basic>
                <ObjectTable
                    data={Object({ ...data })}
                    header={[{ k: 'ident', t: 'label.ident' }, { k: 'name', t: 'label.name' }, { k: "err", t: 'label.error', fn: this.errorCol }]}
                    rowPropFn={this.rowPropFn}
                />
                <Button onClick={this.reset}><FormattedMessage id="label.reset" /></Button>
                <Button onClick={this.sendList}><FormattedMessage id="submit.student.list" /></Button>
            </Segment>
        );
    }
}

interface ReduxFn {
    create: any;
}

interface ReduxProps {
    examid?: number
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected: examid } = state.exams;
    return ({
        examid
    })
}
export default connect(mapStateToProps, { create: examstudent.create, update: examstudent.update })(injectIntl(AddStudentListForm));