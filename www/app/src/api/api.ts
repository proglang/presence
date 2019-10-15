// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios, { AxiosResponse, AxiosError } from 'axios';

import * as _exam from './api.exam'
import * as _examuser from './api.exam.user'
import * as _examlog from './api.exam.log'
import * as _examstudent from './api.exam.student'
import * as _user from './api.user'
import { setToken } from '../util/login';
import { API_PATH } from '../util/settings';
import { IValidationErrorMsg } from '../validator/validator';
import * as eR from '../reducer/error';
import { store } from '..';


// axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_PATH;
// axios.defaults.data = {}


interface IErrorArgs {
    text: string[][],
    keys: string[],
    args: { [key: string]: any[] },

}
interface IServerError {
    code: string;
    msg?: string;
    args?: IErrorArgs;
}
class ValidationError {
    private data: any = {};
    constructor(val: IErrorArgs) {
        val.keys.forEach((key) => {
            const [field, typ] = key.split(".");
            if (!this.data[field]) { this.data[field] = {}; }
            this.data[field][typ.toLowerCase()] = val.args[key];
        });
    };
    check = (field: string): boolean => {
        return !!(this.data[field]);
    }
    checkType = (field: string, type: string): boolean => {
        if (!this.check(field)) return false;
        return !!this.data[field][type];

    }
    getFields = () => {
        return Object.keys(this.data);
    }
    getTypes = (field: string): string[] => {
        if (!this.check(field)) return [];
        return Object.keys(this.data[field]);
    }
    getArgs = (field: string, type: string): any[] => {
        if (!this.check(field)) return [];
        if (!this.checkType(field, type)) return [];
        return this.data[field][type];
    }
    getMessages = (field: string): IValidationErrorMsg[] => {
        return Object.entries(this.data[field]).map(([typ, _args]: any): IValidationErrorMsg => {
            const id = `validation.${field}.${typ}`;
            let args = undefined;
            switch (typ) {
                case "min":
                case "max":
                case "hasdigit":
                case "haslower":
                case "hasupper":
                case "hasspecial":
                    args = { count: _args[0], allowed: _args[1] }
                    break;
                default:
                    break;
            }
            return { id, args };
        })
    }
}
export interface IError {
    validation?: ValidationError,
    internal?: true,
    unhandled?: true,
    login?: true
}

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
    error?: IServerError;
    auth?: string;
}

export const handleSuccess = (res: AxiosResponse<IResponse>): void => {
    if (res.headers['authorization']) {
        setToken(res.headers['authorization']);
    } else if (res.data.auth) {
        setToken(res.data.auth);
    }
}

export const handleError = (res: AxiosError<IResponse>): IError => {
    if (!res.response) return {};
    if (!res.response.data.error) return {};
    const error = res.response.data.error;
    switch (error.code) {
        case "server.internal":
            return { internal: true }
        case "validation.error":
            //@ts-ignore
            return { validation: new ValidationError(error.args) }
        case "user.unauthorized":
            return { login: true }
        case "auth.unknown": // JWT-Token Error
        case "auth.user": // JWT-Token Error
        case "auth.token.disabled":
        case "auth.token.expired":
        case "auth.token.invalid":
            store.dispatch(eR._SET("error.token"))
            _user.logout()(store.dispatch)
            return {}
        default:
            if (error.code.includes("useraccess")) {
                return {};
            }
            store.dispatch(eR._SET("error.unhandled"))
            break;
    }

    return { unhandled: true };
}