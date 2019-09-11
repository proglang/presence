// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as examstudent from '../../api/api.exam.student';
import { Card, Message } from 'semantic-ui-react';

export interface IExamStudentInfoProps {
    id: number;
}

export interface IExamStudentInfoState {
}

class ExamStudentInfo extends React.Component<IExamStudentInfoProps & ReduxProps & WrappedComponentProps, IExamStudentInfoState> {
    constructor(props: IExamStudentInfoProps & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }
    public render() {
        const { id, student } = this.props;
        if (!student[id]) return (<FormattedMessage id="data.notFound" values={{ id }} />)
        const _student = student[id];
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{_student.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{_student.ident}</span>
                    </Card.Meta>

                    <Card.Description>
                        <Message.Header><FormattedMessage id='data.present' values={{ present: _student.present ? 'y' : 'n' }} /></Message.Header>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="data.id" values={{ id: _student.id }} defaultMessage={"<ID: {id}>"} />}
                </Card.Content>
            </Card>
        );
    }
}

interface ReduxProps {
    student: { [key: number]: examstudent.IData };
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected, ...student } = state.examstudent;
    return ({
        student
    })
}
export default connect(mapStateToProps, null)(injectIntl(ExamStudentInfo))