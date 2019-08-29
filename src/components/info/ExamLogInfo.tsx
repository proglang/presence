// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { IReduxRootProps } from '../../rootReducer';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import * as examlog from '../../api/api.exam.log';
import { Card, Message } from 'semantic-ui-react';

export interface IExamLogInfoProps {
    id: number;
}

export interface IExamLogInfoState {
}

class ExamLogInfo extends React.Component<IExamLogInfoProps & ReduxProps & WrappedComponentProps, IExamLogInfoState> {
    constructor(props: IExamLogInfoProps & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        const { id, log } = this.props;
        if (!log[id]) return (<FormattedMessage id="exam.log.notFound" values={{ id }} />)
        const _log = log[id];
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{_log.text}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{_log.date}</span>
                    </Card.Meta>

                    <Card.Description>
                        <Message>
                            <Message.Header><FormattedMessage id='log.present' /></Message.Header>
                            {_log.history?1:0}
                        </Message>
                        <Message>
                            <Message.Header><FormattedMessage id='log.notes' /></Message.Header>
                            Todo
                        </Message>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="log.id" values={{ id: _log.id }} defaultMessage={"<ID: {id}>"} />}
                </Card.Content>
            </Card>
        );
    }
}

interface ReduxProps {
    log: { [key: number]: examlog.IData };
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected, ...log } = state.examlog;
    return ({
        log
    })
}
export default connect(mapStateToProps, null)(injectIntl(ExamLogInfo))