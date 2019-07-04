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