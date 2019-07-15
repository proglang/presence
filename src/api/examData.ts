import { LOGOUT } from './auth'

export interface IExamAccess {
    "nav.test"?:boolean;
}
export interface IExamRoom {
    id: number;
    name: string;
    note: string;
}
export interface IExamRooms {
    [key:number]:IExamRoom
}
export interface IExamData {
    id?: number;
    name?: string;
    useraccess: IExamAccess;
    rooms: IExamRooms;
}

const UPDATE_EXAM_DATA = "UPDATE_EXAM_DATA";
const INITIAL_STATE: IExamData = {
    id: undefined,
    name: undefined,
    useraccess: {
        
    },
    rooms: {

    }

}
// todo: remove!
const FAKE_STATE: IExamData = {
    id: 1,
    name: "Testexam",
    useraccess: {

    },
    rooms: {}

}

const RESET_EXAM_DATA = "RESET_ED"
const ResetData = () => ({type: RESET_EXAM_DATA})
const UpdateData = (data: IExamData) => ({ type: UPDATE_EXAM_DATA, data });

export const selectExam = (id: number) => (dispatch: any) => {
    console.log(id)
    //Todo: actual api calls!
    let data = FAKE_STATE;
    data.id = id;
    dispatch(ResetData())
    dispatch(UpdateData(data));
    //! Workaround as preparation for Async API call
    return new Promise((res) => setTimeout(res, 1000))
}

export const reducer = (state = INITIAL_STATE, action: any = {}) => {
    switch (action.type) {
        case RESET_EXAM_DATA:
            return INITIAL_STATE
        case UPDATE_EXAM_DATA:
            return action.data;
        case LOGOUT:
            return INITIAL_STATE
        default:
            return state;
    }
}