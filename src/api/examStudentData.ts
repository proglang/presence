import { LOGOUT } from './auth'

export interface IExamStudentData {
    name: string;
    sid: number;
}
export type IExamStudentDataList = IExamStudentData[]

const UPDATE_EXAM_STUDENT_DATA = "UPDATE_EXAM_STUDENT_DATA";
const INITIAL_STATE: IExamStudentDataList = [
    { name: 'dummy', sid: 1 },
    { name: 'dummy1', sid: 2 },
    { name: 'dummy2', sid: 3 }
]

const UpdateData = (data: IExamStudentDataList) => ({ type: UPDATE_EXAM_STUDENT_DATA, data });

export const sendData = (data: IExamStudentDataList) => (dispatch: any) => {
    //Todo: actual api calls!
    dispatch(UpdateData(data));
    //! Workaround as preparation for Async API call
    return new Promise((res) => res())
}

export const reducer = (state = INITIAL_STATE, action: any = {}):IExamStudentDataList => {
    switch (action.type) {
        case UPDATE_EXAM_STUDENT_DATA:
            return action.data;
        case LOGOUT:
            return INITIAL_STATE
        default:
            return state;
    }
}