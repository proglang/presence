import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as examstudent from '../../api/api.exam.student';
import { Card, List, Icon, Message } from 'semantic-ui-react';

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
        if (!student[id]) return (<FormattedMessage id="exam.student.notFound" values={{ id }} />)
        const _student = student[id];
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{_student.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{_student.ident}</span>
                    </Card.Meta>

                    <Card.Description>
                        <Message>
                            <Message.Header><FormattedMessage id='student.present' /></Message.Header>
                            {_student.present?1:0}
                        </Message>
                        <Message>
                            <Message.Header><FormattedMessage id='student.notes' /></Message.Header>
                            Todo
                        </Message>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="student.id" values={{ id: _student.id }} defaultMessage={"<ID: {id}>"} />}
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