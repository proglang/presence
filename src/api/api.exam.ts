// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse } from 'axios';
import { handleSuccess, IResponse } from './api';

import * as eReducer from '../reducer/exam';
import * as user from './api.exam.user'
import * as log from './api.exam.log'
import * as student from './api.exam.student'
export interface IUpdateExamData {
    name: string;
    date: number;
}
export interface IData {
    id: number;
    name: string;
    date: number;
    rights: user.TRights;
}

export type IList = { [key: number]: IData, selected?: number }

export const list = () => (dispatch: any) => axios.get('exam')
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.exams) {
            res.data.exams.forEach((value) => value.date = value.date * 1000)
            dispatch(eReducer._SET(res.data.exams))
            if (res.data.exams.length === 1)
                select(res.data.exams[0].id)(dispatch);
        }
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))

export const select = (index: number) => (dispatch: any) => {
    dispatch(eReducer._SELECT(index));
    reload(index)(dispatch);
    return true;
}
export const reload = (index: number) => (dispatch: any) => {
    user.list(index)(dispatch);
    log.list(index)(dispatch);
    student.list(index)(dispatch);
    return true;
}

export const update = (id: number, data: IUpdateExamData) => (dispatch: any) => axios.put(`exam/${id}`, { ...data, date: Math.floor(data.date / 1000) })
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.exam) {
            res.data.exam.date = res.data.exam.date * 1000
            dispatch(eReducer._UPDATE(res.data.exam))
        }
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))

export const del = (id: number) => (dispatch: any) => axios.delete(`exam/${id}`)
    .then((res: AxiosResponse<IResponse>) => {
        dispatch(eReducer._DELETE(id))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) =>
        ({ data: res.response.data.error, code: res.response.status }))

export const create = (data: IUpdateExamData) => (dispatch: any) => axios.post(`exam`, { ...data, date: Math.floor(data.date / 1000) })
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.exam)
            dispatch(eReducer._UPDATE(res.data.exam))
        return true;
    })
    .catch((res: { response: AxiosResponse<IResponse> }) => ({ data: res.response.data.error, code: res.response.status }))