// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Button, Segment, Header, Icon } from "semantic-ui-react";
import ReactDropzone, { DropEvent } from "react-dropzone";

import FilterTable from "../util/FilterTable";
import xlsx from "../../utils/xlsx";

import { injectIntl, InjectedIntlProps } from 'react-intl';
import { FormBase } from './FormBase'
import InputField from '../util/ValidationInputField';
import { connect } from 'react-redux';
import {sendData, IExamAddUserData} from '../../api/examUserData';

//Todo: Validation
export interface IAddUserListFormProps {
}

export interface IAddUserListFormState {
  data: any[][],
  file?: string
}

class AddUserListFormC extends React.Component<IAddUserListFormProps & InjectedIntlProps & { sendData: any}, IAddUserListFormState> {
  constructor(props: any) {
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
    // IExamUserData
    const mydata:IExamAddUserData[] = this.state.data.reduce(
      (result:IExamAddUserData[], data:any[]):IExamAddUserData[] => {
        //Todo: Validation
        result.push({name: data[0], email: data[1], note: data[2]})
        return result
      }, []
    )
    // Todo: Remove validated data
    this.props.sendData(mydata).then(this.applySuccess).catch(()=>console.log(2)); // Todo: Catch errors
  }
  applySuccess = () => {
    var data = this.state.data;
    console.log(data);
    this.setState({data});
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
          <FilterTable header={["common.label.name", "common.lable.mail", "common.label.note"]} data={data} filter={true} verifier={{ 2: () => true }} showErrCol showOverflowData={false} />
        </Segment>
        }
      </Segment>
    );
  }
}

export const AddUserListForm = connect(null, {sendData})(injectIntl(AddUserListFormC))

export interface IAddUserFormProps {
}

export interface IAddUserFormState {
  data: IExamAddUserData;
}

class AddUserFormC extends React.Component<IAddUserFormProps & InjectedIntlProps & { sendData: any}, IAddUserFormState> {
  state: IAddUserFormState = {
    data: {
      name: "",
      email: "",
    }
  }
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } });
  public render() {
    const nl = this.props.intl.formatMessage({ id: "exam.user.label.name" })
    const usl = this.props.intl.formatMessage({ id: "exam.user.label.email" })
    const nol = this.props.intl.formatMessage({ id: "exam.user.label.note" })
    const { data } = this.state;
    //Todo: Input Validation
    return (
      <FormBase button="exam.user.label.submit" onSubmit={() => this.props.sendData([this.state.data])}>
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
      </FormBase>)
  }
}
export const AddUserForm = connect(null, {sendData})(injectIntl(AddUserFormC));
