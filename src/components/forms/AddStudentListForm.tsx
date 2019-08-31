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

class Dropzone extends _Dropzone<examstudent.ICreateData> { };
export interface IAddStudentListFormProps {
}

export interface IAddStudentListFormState {
    error: string | null;
    data: examstudent.ICreateData[]
    errorData: { [key: string]: string }
}

class AddStudentListForm extends React.Component<IAddStudentListFormProps & ReduxProps & ReduxFn & WrappedComponentProps, IAddStudentListFormState> {
    INITIAL_STATE: IAddStudentListFormState = {
        error: null,
        data: [],
        errorData: {}
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
        this.setState({ error: null, data: val })
    }
    sendList = () => {
        const { create, examid } = this.props
        if (!examid) return;
        this.state.data.forEach((data) => {
            create(examid, data);
        })
    }
    public render() {
        const { data } = this.state
        if (data.length === 0)
            return <Segment basic>
                <Dropzone
                    callback={this.setList}
                    head={[{ key: 'ident', index: 1, fn: (val) => String(val) }, { key: 'name', index: 0 }]}
                    startRow={5}
                />
            </Segment >
        return (
            <Segment basic>
                <ObjectTable data={Object({ ...data })} header={[{ k: 'ident', t: 'label.ident' }, { k: 'name', t: 'label.name' }]} />
                <Button onClick={this.reset}><FormattedMessage id="label.reset"/></Button>
                <Button onClick={this.sendList}><FormattedMessage id="submit.student.list"/></Button>
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