import {LOGOUT} from './auth'

export interface IExamUserData {
    name: string;
    email: string;
    note?: string;
}
export interface IExamAddUserData extends IExamUserData {
    token: string;
}

const UPDATE_EXAM_USER_DATA = "UPDATE_EXAM_USER_DATA";
const INITIAL_STATE: IExamUserData[] = [{ name: 'dummy', email: 'dummy' }, { name: 'dummy1', email: 'dummy1' }, { name: 'dummy2', email: 'dummy2' }]

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