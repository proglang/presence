// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Dropdown, Icon, Input, Menu, DropdownProps } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { selectExam } from '../../api/examData'
import { IExamList, updateExamList, IExamListData } from '../../api/examList'
import { IReduxRootProps } from '../../rootReducer';



interface ReduxProps {
    redux: {
        login: boolean;
        selected: number | undefined;
        exams: IExamList;
    }
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    return ({
        redux: {
            login: !!state.auth,
            exams: state.el,
            selected: state.ed.id
        }
    })
}

export interface IExamSelectionDropdownProps {
}

export interface IExamSelectionDropdownState {
    loading: boolean;
}


class ExamSelectionDropdownC extends React.Component<IExamSelectionDropdownProps & ReduxProps & { selectExam: (d?: number) => Promise<any>, updateExamList: () => Promise<any> }, IExamSelectionDropdownState> {
    constructor(props: any) {
        super(props);

        this.state = {
            loading: false
        }
    }

    onChange = (a: React.SyntheticEvent<HTMLElement, Event>, b: DropdownProps) => {
        //Todo: Cancel Requests (e.g. select another exam while the current is loading)
        // signals! (AbortController)
        // Todo: Error Handling
        if (typeof (b.value) !== "number" && b.value !== undefined) return; //Todo: Show Error
        this.setState({ loading: true })
        this.props.selectExam(b.value).then(() => this.setState({ loading: false }))
    }

    componentWillMount = () => {
        //| Send Request to Server
        //Todo: Abort request on unmount
        this.setState({ loading: true })
        this.props.updateExamList().then(() => this.setState({ loading: false }))
        // Todo: Error Handling
    }
    public render() {
        if (!this.props.redux.login) return null;
        const availableExams = this.props.redux.exams.map((value: IExamListData) => ({ key: value.id, value: value.id, text: value.name }))
        //Todo: Localization
        return (
            <Menu.Item>
                <Dropdown
                    placeholder='__Select exam'
                    search
                    value={this.props.redux.selected}
                    selection
                    loading={this.state.loading}
                    options={availableExams}
                    onChange={this.onChange}
                    noResultsMessage="123456"
                />
            </Menu.Item>
        );
    }
}
const ExamSelectionDropdown = connect(mapStateToProps, { selectExam, updateExamList })(ExamSelectionDropdownC);

class ExamSelectionDropdownItemC extends React.Component<ReduxProps, any> {
    public render() {
        if (!this.props.redux.login) return null;
        //Todo: Localization
        return (
            <Menu.Item>
                <ExamSelectionDropdown />
            </Menu.Item>
        );
    }
}

const ExamSelectionDropdownItem = connect(mapStateToProps)(ExamSelectionDropdownItemC);
export default ExamSelectionDropdownItem;