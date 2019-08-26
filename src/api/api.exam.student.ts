// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse } from 'axios';
import { handleSuccess, IResponse } from './api';

import * as esReducer from '../reducer/exam.student';


export interface IUpdateData {
    name: string;
    ident: string;
}

export interface ICreateData extends IUpdateData {
}

export interface IData extends ICreateData {
    id: number;
    present: boolean;
}

export type IList = { [key: number]: IData, selected?: number }

export const select = (student_id: number) => (dispatch: any) => {
    dispatch(esReducer._SELECT(student_id));
    return true;
}
export const reset = () => (dispatch: any) => {
    dispatch(esReducer._RESET());
    return true;
}
export const list = (exam_id: number) => (dispatch: any) => axios.get(`exam/${exam_id}/student`)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examstudents)
            dispatch(esReducer._SET(res.data.examstudents))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))

export const update = (exam_id: number, student_id: number, data: IUpdateData) => (dispatch: any) => axios.put(`exam/${exam_id}/student/${student_id}`, data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examstudent)
            dispatch(esReducer._UPDATE(res.data.examstudent))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))

export const setPresence = (exam_id: number, student_id: number, data: boolean) => (dispatch: any) => axios.put(`exam/${exam_id}/student/${student_id}/presence`, { val: data })
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examstudent)
            dispatch(esReducer._UPDATE(res.data.examstudent))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))
export const del = (exam_id: number, student_id: number) => (dispatch: any) => axios.delete(`exam/${exam_id}/student/${student_id}`)
    .then((res: AxiosResponse<IResponse>) => {
        dispatch(esReducer._DELETE(student_id))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) =>
        ({ data: res.response.data.error, code: res.response.status }))

export const create = (exam_id: number, data: ICreateData) => (dispatch: any) => axios.post(`exam/${exam_id}/student`, data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examstudent)
            dispatch(esReducer._UPDATE(res.data.examstudent))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))