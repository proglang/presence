import axios, { AxiosResponse } from 'axios';

import * as _exam from './api.exam'
import * as _examuser from './api.exam.user'
import * as _examlog from './api.exam.log'
import * as _examstudent from './api.exam.student'
import * as _user from './api.user'
import { setToken } from '../util/login';


// axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:80/api'
// axios.defaults.data = {}


export interface IResponse {
    user?: _user.IUserData;
    exam?: _exam.IData;
    exams?: _exam.IData[];
    examuser?: _examuser.IData;
    examusers?: _examuser.IData[];
    examstudent?: _examstudent.IData;
    examstudents?: _examstudent.IData[];
    examlog?: _examlog.IData;
    examlogs?: _examlog.IData[];
    error?: any;
    auth?: string;
}

export const handleSuccess = (res: AxiosResponse<IResponse>): void => {
    if (res.headers['authorization']) {
        setToken(res.headers['authorization']);
    } else if (res.data.auth) {
        setToken(res.data.auth);
    }
}
