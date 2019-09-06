// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { ChangeEvent, SyntheticEvent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { FormBase } from './FormBase'
import { connect } from 'react-redux';
import * as examuser from '../../api/api.exam.user';
import { Form, Grid, Icon, Label, Dropdown, Responsive } from 'semantic-ui-react';
import { IReduxRootProps } from '../../rootReducer';



export interface IExamUserFormProps {
    add: boolean;
    onSuccess?: () => any
}

export interface IExamUserFormState {
    data: examuser.IData
    self: boolean
    level: string
}

class ExamUserForm extends React.Component<IExamUserFormProps & ReduxFn & ReduxProps & WrappedComponentProps, IExamUserFormState> {
    INIT_VALUES: IExamUserFormState = {
        data: {
            email: "",
            note: "",
            rights: {},
            id: -1,
            name: ''
        },
        self: false,
        level: ''
    }
    constructor(props: IExamUserFormProps & ReduxFn & ReduxProps & WrappedComponentProps) {
        super(props);

        this.state = this.INIT_VALUES;
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
    onChangeCB = (event: SyntheticEvent, data: any) => this.setState({ data: { ...this.state.data, rights: { ...this.state.data.rights, [data.name]: data.checked } } });
    componentDidMount = () => {
        this.reset();
    }
    componentDidUpdate = (props: ReduxProps) => {
        if (props.user === null && this.props.user === null) return;
        if (props.user === null && this.props.user !== null) return this.reset();
        if (props.user !== null && this.props.user === null) return this.reset();
        // @ts-ignore: user cannot be null here
        if (props.user.id !== this.props.user.id) return this.reset();
    }
    reset = () => {
        if (this.props.add) return
        if (!this.props.user) return this.setState(this.INIT_VALUES);
        this.setState({ data: this.props.user, self: this.props.self, level: "" })
    }
    asyncFn = (data: any) => {
        if (data !== true) return;
        if (this.props.add) {
            this.setState({ data: { name: "", note: "", ...this.state.data } })
        }
        if (this.props.onSuccess) {
            this.props.onSuccess();
        }
    }
    send = (): Promise<any> => {
        const { examid } = this.props;
        //@ts-ignore
        if (!examid) return;
        if (this.props.add)
            return new Promise((res) => this.props.create(examid, this.state.data).then((data: any) => { this.asyncFn(data); res(data) }))
        return new Promise((res) => this.props.update(examid, this.state.data.id, this.state.data).then((data: any) => { this.asyncFn(data); res(data) }))
    }
    selectRight = (e: any, { value }: any) => {
        const rights: { [key in examuser.TRight]: boolean } = Object(examuser.rank)[value];
        this.setState({ data: { ...this.state.data, rights }, level: value })
    }
    public render() {
        const note = this.props.intl.formatMessage({ id: "label.note" })
        const email = this.props.intl.formatMessage({ id: "label.email" })
        const { data } = this.state;
        const ri = examuser.rightIcons;
        const baserights = Object.keys(ri);
        // with room: const getIndex = (index: number) => index < 3 ? 0 : index < 7 ? 1 : index < 11 ? 2 : index < 16 ? 3 : 4;
        const getIndex = (index: number) => index < 3 ? 0 : index < 7 ? 1 : index < 12 ? 2 : 3;
        const lst = baserights.reduce((prev: string[][], cur: string, index: number) => { prev[getIndex(index)].push(cur); return prev }, [[], [], [], [], []])

        //@ts-ignore
        const width: number = Responsive.onlyComputer.minWidth
        return (
            <FormBase button={"submit" + (this.props.add ? "" : ".update") + ".user"} onSubmit={this.send}>
                <Form.Input
                    disabled={!this.props.add}
                    style={{ opacity: 1 }}
                    name="email"
                    type="email"
                    label={email}
                    placeholder={email}
                    value={data.email}
                    onChange={this.onChange}
                />
                <Form.Input
                    name="note"
                    type="text"
                    label={note}
                    placeholder={note}
                    value={data.note}
                    onChange={this.onChange}
                />
                <Responsive minWidth={width}>
                    <Grid>
                        {
                            lst.map((value, index) => {
                                //@ts-ignore
                                return <Grid.Row columns={5} key={index}>
                                    {
                                        value.map((val, i) => {
                                            return [<Grid.Column key={i}>
                                                <Form.Checkbox onClick={undefined/*this.onChangeCB*/} checked={!!Object(data.rights)[val]} name={val} label={{
                                                    children:
                                                        <Label>
                                                            <Icon name={examuser.getIcon(val)} color={examuser.getRightColor(val)} />
                                                            <FormattedMessage id={"user.rights." + val} />
                                                        </Label>
                                                }}
                                                />
                                            </Grid.Column>, index === 0 && i === 2 ? <Grid.Column floated={"right"} key={i + 1}>
                                                <Dropdown
                                                    fluid
                                                    search
                                                    placeholder={''}
                                                    value={this.state.level}
                                                    onChange={this.selectRight}
                                                    scrolling
                                                    clearable
                                                    selection
                                                    options={
                                                        Object.keys(examuser.rank).reduce(
                                                            (val, cur, index): any => ([...val, { key: index, value: cur, text: this.props.intl.formatMessage({ id: "user.rank." + cur }) }])
                                                            , [])
                                                    }
                                                />
                                            </Grid.Column> : null]

                                        })
                                    }
                                </Grid.Row>
                            })
                        }
                    </Grid>
                </Responsive >
                <Responsive maxWidth={width - 1}>
                    <Dropdown
                        fluid
                        search
                        placeholder={''}
                        value={this.state.level}
                        onChange={this.selectRight}
                        scrolling
                        clearable
                        selection
                        options={
                            Object.keys(examuser.rank).reduce(
                                (val, cur, index): any => ([...val, { key: index, value: cur, text: this.props.intl.formatMessage({ id: "user.rank." + cur }) }])
                                , [])
                        }
                    />
                </Responsive>
            </FormBase >
        );
    }
}

interface ReduxFn {
    create: any;
    update: any;
}

interface ReduxProps {
    user: examuser.IData | null;
    examid?: number
    self: boolean
}
const mapStateToProps = (state: IReduxRootProps): ReduxProps => {
    const { selected, ..._user } = state.examuser;
    const user = selected ? _user[selected] : null;
    const { selected: examid } = state.exams;
    const self = state.user ? state.user.id === selected : false;
    return ({
        user,
        examid,
        self
    })
}
export default connect(mapStateToProps, { create: examuser.create, update: examuser.update })(injectIntl(ExamUserForm));

