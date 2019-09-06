// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as exam from '../../api/api.exam';
import * as examuser from '../../api/api.exam.user';
import { Card, List, Message, Icon } from 'semantic-ui-react';
import { getDateTimeString } from '../../util/time';

export interface IExamInfoProps {
    id: number;
}

export interface IExamInfoState {
}

class ExamInfo extends React.Component<IExamInfoProps & ReduxProps & WrappedComponentProps, IExamInfoState> {
    constructor(props: IExamInfoProps & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        const { id, exams } = this.props;
        if (!exams[id]) return (<FormattedMessage id="exam.notFound" values={{ id }} />)
        const exam = exams[id];
        const list = Object.entries(exam.rights)
            .filter((val: [string, boolean | undefined]) => val[1] && examuser.getIcon(val[0]))
            .map((val: [string, boolean | undefined], index: number) =>
                <List.Item key={index}>
                    <Icon color={examuser.getRightColor(val[0])} style={{ margin: 0, fontSize: "1.4em" }} size='small' name={examuser.getIcon(val[0])} />
                    <FormattedMessage id={"user.rights." + val[0]} />
                </List.Item>);
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{exam.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{getDateTimeString(this.props.intl, exam.date)}</span>
                    </Card.Meta>
                    <Card.Description>
                        <Message>
                            <Message.Header><FormattedMessage id='label.rights' /></Message.Header>
                            <List>{list}</List>
                        </Message>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="exam.id" values={{ id: exam.id }} defaultMessage={"<ID: {id}>"} />}
                </Card.Content>
            </Card>
        );
    }
}

interface ReduxProps {
    exams: { [key: number]: exam.IData };
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected, ...exams } = state.exams;
    return ({
        exams
    })
}
export default connect(mapStateToProps, null)(injectIntl(ExamInfo))