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
import { getDateTimeString } from '../../util/time';

export interface IExamLogInfoProps {
    id: number;
}

export interface IExamLogInfoState {
}

class ExamLogInfo extends React.Component<IExamLogInfoProps & ReduxProps & WrappedComponentProps, IExamLogInfoState> {
    public render() {
        const { id, log } = this.props;
        if (!log[id]) return (<FormattedMessage id="data.notFound" values={{ id }} />)
        const _log = log[id];
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>{_log.text}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{getDateTimeString(this.props.intl, _log.date)}</span>
                        {_log.student && <br />}
                        {_log.student && <span className='date'>{_log.student}</span>}
                    </Card.Meta>

                    <Card.Description>
                        <Message>
                            {_log.text}
                        </Message>
                        <Message.Header><FormattedMessage id='data.edited' values={{ edited: _log.history }} /></Message.Header>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {<FormattedMessage id="data.id" values={{ id: _log.id }} defaultMessage={"<ID: {id}>"} />}
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
        log: log
    })
}
export default connect(mapStateToProps, null)(injectIntl(ExamLogInfo))
