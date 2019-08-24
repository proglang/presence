// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse } from 'axios';
import { handleSuccess, IResponse } from './api';

import * as eReducer from '../reducer/exam';

export type right = 'view' | 'delete' | 'update' |
    'exam_viewuser' | 'exam_adduser' | 'exam_deleteuser' | 'exam_updateuser' |
    'exam_viewroom' | 'exam_addroom' | 'exam_deleteroom' | 'exam_updateroom' |
    'exam_viewstudent' | 'exam_addstudent' | 'exam_deletestudent' | 'exam_updatestudent' | 'exam_updatestudent_presence' |
    'exam_viewlog' | 'exam_addlog' | 'exam_deletelog' | 'exam_updatelog';

export type rights = {
    [key in right]?: boolean
}
export interface IUpdateExamData {
    name: string;
    date: number;
}
export interface IExamData {
    id: number;
    name: string;
    date: number;
    rights: rights;
}

export type IExamList = { [key: number]: IExamData, selected?: number }

export const list = () => (dispatch: any) => axios.get('exam')
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.exams)
            dispatch(eReducer._SET(res.data.exams))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))

export const select = (index: number) => (dispatch: any) => {
    dispatch(eReducer._SELECT(index));
    return true;
}

export const update = (id: number, data: IUpdateExamData) => (dispatch: any) => axios.put(`exam/${id}`, data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.exam)
            dispatch(eReducer._UPDATE(res.data.exam))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))
export const create = (data: IUpdateExamData) => (dispatch: any) => axios.post(`exam`, data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.exam)
            dispatch(eReducer._UPDATE(res.data.exam))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))