// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IData, IList } from '../api/api.exam.student';
import * as user from './user'
import * as exam from './exam'

const RESET = "EXAM_STUDENT_RESET"
const SET = "EXAM_STUDENT_SET"
const UPDATE = "EXAM_STUDENT_UPDATE"
const SELECT = "EXAM_STUDENT_SELECT"
const DELETE = "EXAM_STUDENT_DELETE"

export const _RESET = () => ({ type: RESET });
export const _SET = (data: IData[]) => ({ type: SET, data });
export const _UPDATE = (data: IData) => ({ type: UPDATE, data });
export const _SELECT = (student_id: number) => ({ type: SELECT, id: student_id });
export const _DELETE = (student_id: number) => ({ type: DELETE, id: student_id });


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