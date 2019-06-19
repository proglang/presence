// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { combineReducers} from 'redux';
import { intlReducer } from 'react-intl-redux'


const rootReducer = combineReducers<any>({
    intl: intlReducer,
})

export default  rootReducer;