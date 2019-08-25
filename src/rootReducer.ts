// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { combineReducers } from 'redux';
import { intlReducer, IntlState } from 'react-intl-redux'
import { reducer as dbg_reducer } from './util/debug';

import { reducer as userReducer } from './reducer/user';
import { IUserData } from './api/api.user';

import { reducer as examReducer } from './reducer/exam';
import { IList as IExamList } from './api/api.exam';

import { reducer as euReducer } from './reducer/exam.user';
import { IList as IExamUserList } from './api/api.exam.user';


import { reducer as esReducer } from './reducer/exam.student';
import { IList as IExamStudentList } from './api/api.exam.student';

export interface IReduxRootProps {
    intl: IntlState
    dbg: boolean
    exams: IExamList
    examuser: IExamUserList
    user: IUserData | null
    examstudent: IExamStudentList
}
const rootReducer = combineReducers<IReduxRootProps>({
    intl: intlReducer,
    dbg: dbg_reducer,
    exams: examReducer,
    examuser: euReducer,
    user: userReducer,
    examstudent: esReducer,
})

export default rootReducer;