// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';

import { IExamUserData } from '../../api/examUserData';
import { Modal, Button, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

export interface IEditUserFormProps {
    data: string[]
    onClose: () => void;
}

export interface IEditUserFormState {
}

class EditUserForm extends React.Component<IEditUserFormProps & InjectedIntlProps & ReduxProps, IEditUserFormState> {
    constructor(props: IEditUserFormProps & InjectedIntlProps & ReduxProps) {
        super(props);

        this.state = {

        }
    }
    reset = () => {

    }
    public render() {
        const visible = this.props.data.length > 0;

        //const data = this.props.eu[this.props.data[0]]
        //todo: Loca
        // Todo: Functionality
        return (

            <Modal open={visible} closeOnEscape={false} closeOnDimmerClick={false} onClose={this.props.onClose}>
                <Modal.Header>
                    Informative Header
                </Modal.Header>
                <Modal.Content>

                    <Dimmer active={false} inverted>
                        <Loader inverted content='Loading' />
                    </Dimmer>
                    Renew token (if not validated yet)<br />
                    Send token<br />
                    Update Access
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.reset}
                        color='yellow'
                        labelPosition='right'
                        icon='cancel'
                        content="Reset"
                    />
                    <Button
                        onClick={this.props.onClose}
                        negative
                        labelPosition='right'
                        icon='cancel'
                        content="Discard"
                    />
                    <Button
                        onClick={this.props.onClose}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Apply'
                    />

                </Modal.Actions>
            </Modal>
        );
    }
}

interface ReduxProps {
    eu: { [key: string]: IExamUserData }
}
const mapStateToProps = (state: { eu: IExamUserData[] }): ReduxProps => {
    var data: { [key: string]: IExamUserData } = {}
    state.eu.forEach((value: IExamUserData) => { data[value.email] = value })
    return ({
        eu: data
    })
}
export default connect(mapStateToProps)(injectIntl(EditUserForm))

