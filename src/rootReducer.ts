// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { combineReducers} from 'redux';
import { intlReducer } from 'react-intl-redux'
import {reducer as dbg_reducer} from './utils/debug'; 

const rootReducer = combineReducers<any>({
    intl: intlReducer,
    dbg: dbg_reducer
})

export default  rootReducer;