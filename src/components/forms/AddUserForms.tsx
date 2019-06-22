// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Button, Segment, Header, Icon } from "semantic-ui-react";
import ReactDropzone, { DropEvent } from "react-dropzone";

import FilterTable from "../util/FilterTable";

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
  data: IUserEntry[],
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
      resolve();
      //userFile.readJSON(file).then(data => resolve(data)).catch(e => reject(e)) 
    })
  }
  readTable = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      resolve();
      /*userFile.readSheet(file).then((d) => {
        d.shift();
        resolve(d);
      }).catch(e => reject(e));*/
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
    this.extfn[ext](acc[0]).then(d => this.setState({  data: d, file: name  })); // Todo: Catch errors
  }

  render() {
    const types = Object.keys(this.extfn).map(item => '.' + item);
    // const { data, file } = this.state;
    return (
      <ReactDropzone multiple={false} accept={types} onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} onClick={undefined}>
            <Segment placeholder>
              <Header icon>
                <Icon name='file excel' />
                <input {...getInputProps()} />
              </Header>
              <Button primary onClick={getRootProps().onClick}>Add Document</Button>
              <FilterTable onClick={console.log} header={[1,2,3]} data={[[1,2,3],[4,5,6,7,8]]} verifier={{2:()=>false}} showErrCol showOverflowData/>
            </Segment>
          </div>
        )}
      </ReactDropzone>
    );
  }
}


export interface IAddUserFormProps {
  data: IUserEntry[];
}

export interface IAddUserFormState {
}

export class AddUserForm extends React.Component<IAddUserFormProps, IAddUserFormState> {
  constructor(props: IAddUserFormProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div>

      </div>
    );
  }
}
