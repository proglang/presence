// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { combineReducers} from 'redux';
import { intlReducer } from 'react-intl-redux'
import {reducer as dbg_reducer} from './utils/debug'; 
import {reducer as examUserReducer, IExamUserDataList} from './api/examUserData';
import {reducer as authReducer, IUserData} from './api/auth';
import {reducer as examListReducer, IExamList} from './api/examList'
import {reducer as examDataReducer, IExamData} from './api/examData'

export interface IReduxRootProps {
    intl: any
    dbg: boolean
    eu: IExamUserDataList
    auth:IUserData
    el: IExamList
    ed: IExamData
}
const rootReducer = combineReducers<IReduxRootProps>({
    intl: intlReducer,
    dbg: dbg_reducer,
    eu: examUserReducer,
    auth: authReducer,
    el: examListReducer,
    ed: examDataReducer
})

export default  rootReducer;