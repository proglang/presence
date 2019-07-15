import { LOGOUT } from './auth'
import { trace } from '../utils/debug';

export interface IExamListData {
    id: number;
    name: string;
}

export type IExamList = IExamListData[]
const UPDATE_EXAM_LIST = "UPDATE_EXAM_LIST";
const INITIAL_STATE: IExamList = []


const UpdateData = (data: IExamList) => ({ type: UPDATE_EXAM_LIST, data });

export const updateExamList = () => (dispatch: any) => {
    // trace('updateExamList');
    //Todo: actual api calls!
    const data: IExamList = [
        { id: 0, name: "0" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 5, name: "5" },
        { id: 8, name: "8" },
        { id: 10, name: "10" },
    ];
    //   dispatch(UpdateData(data));

    //! Workaround as preparation for Async API call
    return new Promise((res) => setTimeout(() => {
        dispatch(UpdateData(data)); res()
    }, 10000))
}

export const reducer = (state = INITIAL_STATE, action: any = {}): IExamList => {
    switch (action.type) {
        case UPDATE_EXAM_LIST:
            return action.data;
        case LOGOUT:
            return INITIAL_STATE
        default:
            return state;
    }
}