// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


export interface ILoginData {
    email: string;
    password: string;
}

export interface ITokenLoginData extends ILoginData {
    token: string;
}
export interface IRegisterData extends ILoginData {
    name: string;
    tos: boolean;
}

export interface IForgottenPasswordData {
    email: string;
}

interface _IUserData {
    email: string;
    name: string;
    token: string;
}

export type IUserData = _IUserData|null
export const LOGOUT = "LOGOUT"
export const LOGIN = "LOGIN"

const _Login = (data: IUserData) => ({ type: LOGIN, data });
const _Logout = () => ({ type: LOGOUT });

export const login = (data: ILoginData) => (dispatch: any) => {
    //Todo: actual api calls!
    const data:IUserData = { email: "mail", name: "name", token:"token"};
    dispatch(_Login(data));
    //todo: second dispatch to update examData
    //! Workaround as preparation for Async API call
    return new Promise((res) => res())
}
export const logout = (data: ILoginData) => (dispatch: any) => {
    //Todo: actual api calls!
    dispatch(_Logout());
    //! Workaround as preparation for Async API call
    return new Promise((res) => res())
}
const INITIAL_STATE:IUserData = null

export const reducer = (state:IUserData = INITIAL_STATE, action:any  = {}):IUserData => {
    switch (action.type) {
        case LOGIN:
            return action.data;
        case LOGOUT:
            return INITIAL_STATE
        default:
            return state;
    }
}