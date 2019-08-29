// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { IReduxRootProps } from '../../rootReducer';
import * as user from '../../api/api.user';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';

export interface IUserPageProps {
}

export interface IUserPageState {
}

class UserPage extends React.Component<IUserPageProps & ReduxProps & ReduxFn & WrappedComponentProps, IUserPageState> {
    constructor(props: IUserPageProps & ReduxProps & ReduxFn & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }
    del = () => {
        this.props.delete();
    }
    public render() {
        return (
            <Button onClick={this.del} />
        );
    }
}

interface ReduxProps {
    user: user.IUserData;
}
interface ReduxFn {
    delete: any;
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {

    return ({
        //@ts-ignore
        user: state.user
    })
}
export default connect(mapStateToProps, { delete: user.del })(injectIntl(UserPage))