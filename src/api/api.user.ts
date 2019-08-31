// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse, AxiosError } from 'axios';
import * as uReducer from '../reducer/user';
import { handleSuccess, IResponse, handleError } from './api';
import { deleteToken, getToken, setToken } from '../util/login';
import { list } from './api.exam'

export interface IRegisterData {
    email: string;
    password: string;
    name: string;
}
export interface ILoginData {
    email: string;
    password: string;
}
export interface IUserData {
    id: number;
    email: string;
    name: string;
}

const setUser = (res: IUserData | undefined, dispatch: any) => {
    if (res === undefined) {
        deleteToken();
        dispatch(uReducer._RESET());
        return;
    }
    list()(dispatch);
    dispatch(uReducer._UPDATE(res));
}

export const token_login = () => (dispatch: any) => {
    setToken(getToken());

    return axios.post('user/login/jwt')
        .then((res: AxiosResponse<IResponse>) => {
            handleSuccess(res);
            setUser(res.data.user, dispatch);
            return true;
        })
        .catch(() => {
            setUser(undefined, dispatch);
            return false;
        })
}

export const login = (data: ILoginData) => (dispatch: any) => axios.post('user/login', data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        setUser(res.data.user, dispatch);
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const register = (data: IRegisterData) => (dispatch: any) => axios.post('user/register', data)
    .then((res: AxiosResponse<IResponse>) => {
        handleSuccess(res);
        setUser(res.data.user, dispatch);
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));



export const del = () => (dispatch: any) => axios.delete('user')
    .then((res: AxiosResponse<IResponse>) => {
        return true;
    })
    .catch((res: AxiosError<IResponse>) => handleError(res));

export const logout = () => (dispatch: any) => {
    setUser(undefined, dispatch);
    axios.get('user/logout');
}

