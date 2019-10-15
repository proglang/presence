// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IData, IList } from '../api/api.exam.user';
import * as user from './user'
import * as exam from './exam'

const RESET = "EXAM_USER_RESET"
const SET = "EXAM_USER_SET"
const UPDATE = "EXAM_USER_UPDATE"
const SELECT = "EXAM_USER_SELECT"
const DELETE = "EXAM_USER_DELETE"

export const _RESET = () => ({ type: RESET });
export const _SET = (data: IData[]) => ({ type: SET, data });
export const _UPDATE = (data: IData) => ({ type: UPDATE, data });
export const _SELECT = (user_id: number) => ({ type: SELECT, id: user_id });
export const _DELETE = (user_id: number) => ({ type: DELETE, id: user_id });


const INITIAL_STATE: IList = {}
export const reducer = (state: IList = INITIAL_STATE, action: any = {}): IList => {
    switch (action.type) {
        case SET:
            {
                const list = action.data.reduce((acc: any, cur: IData) => { acc[cur.id] = cur; return acc; }, {});
                const selected = (state.selected && list[state.selected]) ? state.selected : undefined;
                return { ...list, selected }
            }
        case UPDATE:
            if (state === null) {
                return { [action.data.id]: action.data };
            }
            return { ...state, [action.data.id]: action.data }
        case SELECT:
            return { ...state, selected: action.id }
        case DELETE:
            const { selected, [action.id]: data, ...list } = state;
            return { selected: selected === action.id ? undefined : selected, ...list };
        case RESET:
        case user.RESET:
        case exam.RESET:
        case exam.SELECT:
        case exam.DELETE:
            return INITIAL_STATE
        default:
            return state;
    }
}