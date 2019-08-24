import { IExamData, IExamList } from '../api/api.exam';
import * as user from './user'

const RESET = "EXAM_RESET"
const SET = "EXAM_SET"
const UPDATE = "EXAM_UPDATE"
const SELECT = "EXAM_RESET"
const DELETE = "EXAM_DELETE"

export const _RESET = () => ({ type: RESET });
export const _SET = (data: IExamData[]) => ({ type: SET, data });
export const _UPDATE = (data: IExamData) => ({ type: UPDATE, data });
export const _SELECT = (data: number) => ({ type: SELECT, data });
export const _DELETE = (data: number) => ({ type: DELETE, data });


const INITIAL_STATE: IExamList = {}
export const reducer = (state: IExamList = INITIAL_STATE, action: any = {}): IExamList => {
    switch (action.type) {
        case SET:
            {
                const list = action.data.reduce((acc: any, cur: IExamData) => { acc[cur.id] = cur; return acc; }, {});
                const selected = (state.selected && list[state.selected])?state.selected:undefined;
                return {...list, selected}
            }
        case UPDATE:
            if (state === null) {
                return { [action.data.id]: action.data };
            }
            return { ...state, [action.data.id]: action.data }
        case SELECT:
            return { ...state, selected: action.data }
        case DELETE:
            const { selected, [action.id]: data, ...list } = state;
            return { selected: selected === data.id ? undefined : selected, ...list };
        case RESET:
        case user.RESET:
            return INITIAL_STATE
        default:
            return state;
    }
}