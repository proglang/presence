// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as user from '../../api/api.user';
import { Card } from 'semantic-ui-react';

export interface IUserInfoProps {
}

interface IUserInfoState {
}

class UserInfo extends React.Component<IUserInfoProps & ReduxProps & WrappedComponentProps, IUserInfoState> {
    constructor(props: IUserInfoProps & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        const { user } = this.props;
        if (!user) return (<FormattedMessage id="user.notFound" />)
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{user.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{user.email}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="exam.id" values={{ id: user.id }} defaultMessage={"<ID: {id}>"} />}
                </Card.Content>
            </Card>
        );
    }
}

interface ReduxProps {
    user: user.IUserData;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { user } = state;
    return ({
        //@ts-ignore
        user
    })
}
export default connect(mapStateToProps, null)(injectIntl(UserInfo))