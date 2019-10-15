// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as eReducer from '../reducer/error';


export const set = (err: eReducer.TError) => (dispatch: any) => {
    if (err)
        return dispatch(eReducer._SET(err))
    return dispatch(eReducer._RESET());
}