import { IData, IList } from '../api/api.exam.log';
import * as user from './user'
import * as exam from './exam'

const RESET = "EXAM_LOG_RESET"
const SET = "EXAM_LOG_SET"
const UPDATE = "EXAM_LOG_UPDATE"
const SELECT = "EXAM_LOG_SELECT"
const DELETE = "EXAM_LOG_DELETE"

export const _RESET = () => ({ type: RESET });
export const _SET = (data: IData[]) => ({ type: SET, data });
export const _UPDATE = ( data: IData) => ({ type: UPDATE, data });
export const _SELECT = (log_id: number) => ({ type: SELECT, id: log_id });
export const _DELETE = (log_id: number) => ({ type: DELETE, id: log_id });


const INITIAL_STATE: IList = {}
export const reducer = (state: IList = INITIAL_STATE, action: any = {}): IList => {
    switch (action.type) {
        case SET:
            {
                const list = action.data.reduce((acc: any, cur: IData) => { acc[cur.id] = cur; return acc; }, {});
                const selected = (state.selected && list[state.selected])?state.selected:undefined;
                return {...list, selected}
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
        case exam.DELETE:
            return INITIAL_STATE
        default:
            return state;
    }
}