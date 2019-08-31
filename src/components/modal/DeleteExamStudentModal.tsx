// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import  * as examstudent from '../../api/api.exam.student';
import ExamStudentInfo from '../info/ExamStudentInfo';

export interface IDeleteExamStudentModalProps {
    id: number;
    exam: number;
}

export interface IDeleteExamStudentModalState {
    visible: boolean;
    loading: boolean;
}

class DeleteExamStudentModal extends React.Component<IDeleteExamStudentModalProps & ReduxFn & WrappedComponentProps, IDeleteExamStudentModalState> {
    _IsMounted = false;
    constructor(props: IDeleteExamStudentModalProps & ReduxFn & WrappedComponentProps) {
        super(props);

        this.state = {
            visible: false,
            loading: false
        }
    }
    public componentDidMount() {
        this._IsMounted = true;
    }
    public componentWillUnmount() {
        this._IsMounted = false;
    }
    onActionClick = (event: React.SyntheticEvent, data: any) => {
        if (this.state.loading === true) return;
        if (data.negative === true) {
            this.setState({ loading: true })
            //Todo: Check Server Error Messages
            this.props.delete(this.props.exam, this.props.id).then((ret: any) => {
                if (!this._IsMounted) return;
                this.setState({ visible: false, loading: false })
            });
        } else {
            this.setState({ visible: false });
        }
    }
    public render() {
        return (
            [
                <Button key="trigger" basic icon='delete' onClick={() => this.setState({ visible: true })} />,

                <Modal key="modal" open={this.state.visible}
                    onClose={() => this.setState({ visible: false })}
                    closeOnEscape={true}
                    closeOnDimmerClick={false}
                    closeIcon
                >
                    <Modal.Header>
                        <FormattedMessage id="exam.student.delete" />
                    </Modal.Header>
                    <Modal.Content>
                        <ExamStudentInfo id={this.props.id} />
                    </Modal.Content>
                    <Modal.Actions
                        onActionClick={this.onActionClick}
                        actions={[
                            this.props.intl.formatMessage({ "id": "label.cancel" }),
                            { key: 'delete', negative: true, content: this.props.intl.formatMessage({ "id": "label.delete" }), loading: this.state.loading },
                        ]}
                    />
                </Modal>
            ]
        );
    }
}

interface ReduxFn {
    delete: any;
}
export default connect(null, { delete: examstudent.del })(injectIntl(DeleteExamStudentModal))
