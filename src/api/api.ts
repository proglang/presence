import axios, { AxiosResponse } from 'axios';

import  * as _exam from './api.exam'
import * as _user from './api.user'
import { setToken } from '../util/login';

export const exam = _exam;
export const user = _user;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:80/api'
// axios.defaults.data = {}


export interface IResponse {
    user?: _user.IUserData;
    exam?: _exam.IExamData;
    exams?: _exam.IExamData[];
    error?: any;
    auth?: string;
}

export const handleSuccess = (res: AxiosResponse<IResponse>): void => {
    console.log(res);
    if (res.headers['authorization']) {
        setToken(res.headers['authorization']);
    } else if (res.data.auth) {
        setToken(res.data.auth);
    }
}
