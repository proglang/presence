// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { combineReducers} from 'redux';
import { intlReducer } from 'react-intl-redux'
import {reducer as dbg_reducer} from './utils/debug'; 
import {reducer as examUserReducer} from './api/examUserData';
import {reducer as authReducer} from './api/auth';

const rootReducer = combineReducers<any>({
    intl: intlReducer,
    dbg: dbg_reducer,
    eu: examUserReducer,
    auth: authReducer,
})

export default  rootReducer;