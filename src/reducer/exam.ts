import * as exam from '../api/api.exam';
import * as user from './user'

export const RESET = "EXAM_RESET"
const SET = "EXAM_SET"
const UPDATE = "EXAM_UPDATE"
const SELECT = "EXAM_SELECT"
export const DELETE = "EXAM_DELETE"

export const _RESET = () => ({ type: RESET });
export const _SET = (data: exam.IData[]) => ({ type: SET, data });
export const _UPDATE = (data: exam.IData) => ({ type: UPDATE, data });
export const _SELECT = (id: number) => ({ type: SELECT, id });
export const _DELETE = (id: number) => ({ type: DELETE, id });


const INITIAL_STATE: exam.IList = {}
export const reducer = (state: exam.IList = INITIAL_STATE, action: any = {}): exam.IList => {
    switch (action.type) {
        case SET:
            {
                const list = action.data.reduce((acc: any, cur: exam.IData) => { acc[cur.id] = cur; return acc; }, {});
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
            return INITIAL_STATE
        default:
            return state;
    }
}