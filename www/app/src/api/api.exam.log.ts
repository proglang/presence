// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse, AxiosError } from 'axios';
import { handleSuccess, IResponse, handleError } from './api';

import * as elReducer from '../reducer/exam.log';

export interface IUpdateData {
    text: string;
}

export interface ICreateData extends IUpdateData {
}

export interface IData extends ICreateData {
    id: number;
    date: number;
    history: number;
    student: number | null;
}

export type IList = { [key: number]: IData, selected?: number }

export const select = (log_id: number) => (dispatch: any) => {
    dispatch(elReducer._SELECT(log_id));
    return true;
}
export const reset = () => (dispatch: any) => {
    dispatch(elReducer._RESET());
    return true;
}
export const list = (exam_id: number) => (dispatch: any) => axios.get(`exam/${exam_id}/log`)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examlogs) {
            res.data.examlogs.forEach((value) => value.date = value.date * 1000)
            dispatch(elReducer._SET(res.data.examlogs))
        }
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const update = (exam_id: number, log_id: number, data: string) => (dispatch: any) => axios.put(`exam/${exam_id}/log/${log_id}`, { text: data })
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examlog) {
            res.data.examlog.date = res.data.examlog.date * 1000
            dispatch(elReducer._UPDATE(res.data.examlog))
        }
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const del = (exam_id: number, log_id: number) => (dispatch: any) => axios.delete(`exam/${exam_id}/log/${log_id}`)
    .then((res: AxiosResponse<IResponse>) => {
        dispatch(elReducer._DELETE(log_id))
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const create = (exam_id: number, data: string) => (dispatch: any) => axios.post(`exam/${exam_id}/log`, { text: data })
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        
        if (res.data.examlog) {
            res.data.examlog.date = res.data.examlog.date * 1000
            dispatch(elReducer._UPDATE(res.data.examlog))
        }
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const create2 = (exam_id: number, student_id: number, data: string) => (dispatch: any) => axios.post(`exam/${exam_id}/log/${student_id}`, { text: data })
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        if (res.data.examlog) {
            res.data.examlog.date = res.data.examlog.date * 1000
            dispatch(elReducer._UPDATE(res.data.examlog))
        }
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));