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
import { IExamList } from './api/api.exam';
/*import {reducer as examListReducer} from './api/examListReducer';
import { IExamList, IUserData } from './api/data';*/

export interface IReduxRootProps {
    intl: IntlState
    dbg: boolean
    exams: IExamList
    user: IUserData | null
}
const rootReducer = combineReducers<IReduxRootProps>({
    intl: intlReducer,
    dbg: dbg_reducer,
    exams: examReducer,
    user: userReducer
})

export default rootReducer;