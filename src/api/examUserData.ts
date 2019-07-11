import { LOGOUT } from './auth'

export interface IExamAddUserData {
    name: string;
    email: string;
    note?: string;

}
export interface IExamUserData extends IExamAddUserData {
    token?: string;
    useDate?: number; // date
    createDate: number; // date
}

const UPDATE_EXAM_USER_DATA = "UPDATE_EXAM_USER_DATA";
const INITIAL_STATE: IExamUserData[] = [
    { name: 'dummy', email: 'dummy', createDate: 1, useDate: Date.now() },
    { name: 'dummy1', email: 'dummy1', createDate: 2 },
    { name: 'dummy2', email: 'dummy2', createDate: 3 }
]

const UpdateData = (data: IExamUserData[]) => ({ type: UPDATE_EXAM_USER_DATA, data });

export const sendData = (data: IExamUserData[]) => (dispatch: any) => {
    //Todo: actual api calls!
    dispatch(UpdateData(data));
    //! Workaround as preparation for Async API call
    return new Promise((res) => res())
}

export const reducer = (state = INITIAL_STATE, action: any = {}) => {
    switch (action.type) {
        case UPDATE_EXAM_USER_DATA:
            return action.data;
        case LOGOUT:
            return INITIAL_STATE
        default:
            return state;
    }
}