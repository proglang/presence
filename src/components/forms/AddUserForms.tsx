// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Button, Segment, Header, Icon, Form } from "semantic-ui-react";
import ReactDropzone, { DropEvent } from "react-dropzone";

import FilterTable from "../util/FilterTable";
import xlsx from "../../utils/xlsx";

import { injectIntl, InjectedIntlProps } from 'react-intl';
import { FormBase } from './FormBase'
import InputField from '../util/ValidationInputField';
import { connect, DispatchProp } from 'react-redux';


//Todo: Validation
//Todo: Move UserEntry to separate file
interface IUserEntry {
  name: string;
  email: string;
  note: string;
}

export interface IAddUserListFormProps {
}

export interface IAddUserListFormState {
  data: any[][],
  file?: string
}

export class AddUserListForm extends React.Component<IAddUserListFormProps, IAddUserListFormState> {
  constructor(props: IAddUserListFormProps) {
    super(props);

    this.state = {
      data: [],
      file: undefined
    }
  }
  verify = (data: any[]): boolean => {
    return true;
  }
  readJSON = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      xlsx.readJSON(file).then(data => resolve(data)).catch(e => reject(e))
    })
  }
  readTable = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      xlsx.readSheet(file).then((d) => {
        d.shift();
        resolve(d);
      }).catch(e => reject(e));
    })
  }


  extfn: { [key: string]: ((file: File) => Promise<any>) } = {
    "json": this.readJSON,
    "csv": this.readTable,
    "xls": this.readTable,
    "xlsx": this.readTable
  }
  onDrop = (acc: File[], rej: File[], ev: DropEvent) => {
    if (acc.length === 0) return;
    const name = acc[0].name
    const ext = name.split('.').pop();
    if (ext === undefined) return;
    this.extfn[ext](acc[0]).then(d => this.setState({ data: d, file: name })).catch(e => console.log(e)); // Todo: Catch errors
  }
  apply = () => {
    console.log("sending data...") //Todo: Send Data
  }
  render() {
    const types = Object.keys(this.extfn).map(item => '.' + item);
    const { data, file } = this.state;
    return (
      <Segment basic>
        {!file && <ReactDropzone multiple={false} accept={types} onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <Segment placeholder>
              <div {...getRootProps()} onClick={undefined}>
                <Header icon textAlign="center">
                  <Icon name='file excel' />
                  <input {...getInputProps()} />
                </Header>
                <Button primary onClick={getRootProps().onClick}>__LOCA__ ADD DOCUMENT</Button>
              </div>
            </Segment>
          )}
        </ReactDropzone>}
        {!!file && <Segment as="section" className="tempdata">
          <Button primary onClick={this.apply}>__LOCA__ Send</Button>
          <Button secondary onClick={() => this.setState({ data: [], file: undefined })}>__LOCA__ CLEAR</Button>
          <FilterTable header={["__LOCA__ NAME", "__LOCA__ EMAIL", "__LOCA__ NOTE"]} data={data} filter={true} verifier={{ 2: () => true }} showErrCol showOverflowData={false} />
        </Segment>
        }
      </Segment>
    );
  }
}


export interface IAddUserFormProps {
}

export interface IAddUserFormState {
  data: IUserEntry;
}

class AddUserFormC extends React.Component<IAddUserFormProps & InjectedIntlProps & DispatchProp & test, IAddUserFormState> {
  state: IAddUserFormState = {
    data: {
      name: "",
      email: "",
      note: "",
    }
  }
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
  public render() {
    const nl = this.props.intl.formatMessage({ id: "exam.user.label.name" })
    const usl = this.props.intl.formatMessage({ id: "exam.user.label.email" })
    const nol = this.props.intl.formatMessage({ id: "exam.user.label.note" })
    console.log(this.props)
    const { data } = this.state;
    //Todo: Input Validation
    //Todo: Submit Function
    return (
      <FormBase button="exam.user.label.submit" onSubmit={() => new Promise((res, rej) => res('test'))}>
        <InputField
          icon="user"
          iconPosition="left"
          name="name"
          label={nl}
          placeholder={nl}
          value={data.name}
          onChange={this.onChange}
          validator={() => { return true }}
        />
        <InputField
          icon="user"
          iconPosition="left"
          name="email"
          type="email"
          label={usl}
          placeholder={usl}
          value={data.email}
          onChange={this.onChange}
          validator={() => { return true }}
        />
        <InputField
          icon="user"
          iconPosition="left"
          name="note"
          type="text"
          label={nol}
          placeholder={nol}
          value={data.note}
          onChange={this.onChange}
        />
        <Button onClick={() => this.props.dispatch(debug(123))}>
          {String(this.props.redux.getData())}
                </Button>
      </FormBase>)
  }
}
interface test {
  redux: {
    getData:()=>any
  }
}
const mapStateToProps1 = (state: any):test => {
  console.log(state);

  return ({
    redux: {
      getData:() => state.dbg
    }
  })
}

const debug = (debug: any) => ({ type: "TOGGLE_DEBUG", debug });
export const AddUserForm = connect(mapStateToProps1)(injectIntl(AddUserFormC));
