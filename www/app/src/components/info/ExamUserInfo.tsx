// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as examuser from '../../api/api.exam.user';
import { Card, List, Icon, Message } from 'semantic-ui-react';

export interface IExamUserInfoProps {
    id: number;
}

export interface IExamUserInfoState {
}

class ExamUserInfo extends React.Component<IExamUserInfoProps & ReduxProps & WrappedComponentProps, IExamUserInfoState> {
    constructor(props: IExamUserInfoProps & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        const { id, user } = this.props;
        if (!user[id]) return (<FormattedMessage id="data.notFound" values={{ id }} />)
        const _user = user[id];
        const list = Object.entries(_user.rights)
            .filter((val: [string, boolean | undefined]) => val[1])
            .map((val: [string, boolean | undefined], index: number) =>
                <List.Item key={index}>
                    <Icon color={examuser.getRightColor(val[0])} style={{ margin: 0, fontSize: "1.4em" }} size='small' name={examuser.getIcon(val[0])} />
                    <FormattedMessage id={"user.rights." + val[0]} />
                </List.Item>);
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{_user.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{_user.email}</span>
                    </Card.Meta>

                    <Card.Description>
                        <Message>
                            <Message.Header><FormattedMessage id='label.note' /></Message.Header>
                            {_user.note}
                        </Message>
                        <Message>
                            <Message.Header><FormattedMessage id='label.rights' /></Message.Header>
                            <List>{list}</List>
                        </Message>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="data.id" values={{ id: _user.id }} defaultMessage={"<ID: {id}>"} />}
                </Card.Content>
            </Card>
        );
    }
}

interface ReduxProps {
    user: { [key: number]: examuser.IData };
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected, ...user } = state.examuser;
    return ({
        user
    })
}
export default connect(mapStateToProps, null)(injectIntl(ExamUserInfo))