// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse, AxiosError } from 'axios';
import { handleSuccess, IResponse, handleError } from './api';

import * as euReducer from '../reducer/exam.user';
import { SemanticICONS, SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

export type TRight = 'view' | 'delete' | 'update' |
    'exam_viewuser' | 'exam_adduser' | 'exam_deleteuser' | 'exam_updateuser' |
   // 'exam_viewroom' | 'exam_addroom' | 'exam_deleteroom' | 'exam_updateroom' |
    'exam_viewstudent' | 'exam_addstudent' | 'exam_deletestudent' | 'exam_updatestudent' | 'exam_updatestudent_presence' |
    'exam_viewlog' | 'exam_addlog' | 'exam_deletelog' | 'exam_updatelog';


export const rightIcons: { [key in TRight]: SemanticICONS } = {
    'view': 'clipboard',
    'update': 'clipboard',
    'delete': 'clipboard',

    'exam_viewuser': 'address book',
    'exam_updateuser': 'address book',
    'exam_deleteuser': 'address book',
    'exam_adduser': 'address book',

  /*  'exam_viewroom': 'map marker alternate',
    'exam_updateroom': 'map marker alternate',
    'exam_deleteroom': 'map marker alternate',
    'exam_addroom': 'map marker alternate',*/

    'exam_viewstudent': 'graduation cap',
    'exam_updatestudent': 'graduation cap',
    'exam_deletestudent': 'graduation cap',
    'exam_addstudent': 'graduation cap',
    'exam_updatestudent_presence': 'graduation cap',

    'exam_viewlog': 'tasks',
    'exam_updatelog': 'tasks',
    'exam_deletelog': 'tasks',
    'exam_addlog': 'tasks',
}

export type TRank = 'null' | 'updater' | 'admin'
export const rank: { [key in TRank]: { [key in TRight]: boolean } } = {
    null: {
        view: false,
        update: false,
        delete: false,

        exam_viewuser: false,
        exam_updateuser: false,
        exam_deleteuser: false,
        exam_adduser: false,

  /*      exam_viewroom: false,
        exam_updateroom: false,
        exam_deleteroom: false,
        exam_addroom: false,*/

        exam_viewstudent: false,
        exam_updatestudent: false,
        exam_deletestudent: false,
        exam_addstudent: false,
        exam_updatestudent_presence: false,

        exam_viewlog: false,
        exam_updatelog: false,
        exam_deletelog: false,
        exam_addlog: false,

    },
    updater: {
        view: true,
        update: true,
        delete: false,

        exam_viewuser: false,
        exam_updateuser: false,
        exam_deleteuser: false,
        exam_adduser: false,

    /*    exam_viewroom: true,
        exam_updateroom: false,
        exam_deleteroom: false,
        exam_addroom: false,*/

        exam_viewstudent: true,
        exam_updatestudent: true,
        exam_deletestudent: false,
        exam_addstudent: false,
        exam_updatestudent_presence: true,

        exam_viewlog: true,
        exam_updatelog: true,
        exam_deletelog: true,
        exam_addlog: true,

    },
    admin: {
        view: true,
        update: true,
        delete: true,

        exam_viewuser: true,
        exam_updateuser: true,
        exam_deleteuser: true,
        exam_adduser: true,

   /*     exam_viewroom: true,
        exam_updateroom: true,
        exam_deleteroom: true,
        exam_addroom: true,*/

        exam_viewstudent: true,
        exam_updatestudent: true,
        exam_deletestudent: true,
        exam_addstudent: true,
        exam_updatestudent_presence: true,

        exam_viewlog: true,
        exam_updatelog: true,
        exam_deletelog: true,
        exam_addlog: true,
    }
}

export const getIcon = (r: TRight | string): SemanticICONS => {
    return Object(rightIcons)[r]
}
export const getRightColor = (r: TRight | string): SemanticCOLORS | undefined => {
    if (r.includes('view')) return 'black';
    if (r.includes('add')) return 'green';
    if (r.includes('delete')) return 'red';
    if (r.includes('presence')) return 'orange';
    if (r.includes('update')) return 'blue';
    return undefined;
}

export type TRights = {
    [key in TRight]?: boolean
}


export interface IUpdateData {
    note: string;
    rights: TRights;
}

export interface ICreateData extends IUpdateData {
    email: string;
}

export interface IData extends ICreateData {
    id: number;
    name: string;
}

export type IList = { [key: number]: IData, selected?: number }

export const select = (user_id: number) => (dispatch: any) => {
    dispatch(euReducer._SELECT(user_id));
    return true;
}
export const reset = () => (dispatch: any) => {
    dispatch(euReducer._RESET());
    return true;
}
export const list = (exam_id: number) => (dispatch: any) => axios.get(`exam/${exam_id}/user`)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examusers)
            dispatch(euReducer._SET(res.data.examusers))
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const update = (exam_id: number, user_id: number, data: IUpdateData) => (dispatch: any) => axios.put(`exam/${exam_id}/user/${user_id}`, data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examuser)
            dispatch(euReducer._UPDATE(res.data.examuser))
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const del = (exam_id: number, user_id: number) => (dispatch: any) => axios.delete(`exam/${exam_id}/user/${user_id}`)
    .then((res: AxiosResponse<IResponse>) => {
        dispatch(euReducer._DELETE(user_id))
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const create = (exam_id: number, data: ICreateData) => (dispatch: any) => axios.post(`exam/${exam_id}/user`, data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examuser)
            dispatch(euReducer._UPDATE(res.data.examuser))
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));