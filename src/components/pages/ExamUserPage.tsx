// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import * as ExamUserForms from '../forms/AddUserForms'
export interface IExamUserPageProps {
}

export default class ExamUserPage extends React.Component<IExamUserPageProps, any> {
  public render() {
    return (
      <div>
        <ExamUserForms.AddUserListForm />
      </div>
    );
  }
}
