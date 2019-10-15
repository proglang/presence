// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios from "axios";

var _token: string | null = localStorage.getItem('token');
export const getToken = () => {
    return _token;
}
const _setToken = (token: string | null) => {
    _token = token;
    if (token === null) {
        delete axios.defaults.headers.common.authorization;
    } else {
        axios.defaults.headers.common.authorization = token;
    }
    if (token === null) {
        localStorage.removeItem('token');
    } else {
        localStorage.setItem('token', token);
    }
}
export const setToken = (token: string | null) => {
    _setToken(token);
}
export const deleteToken = () => {
    _setToken(null);
}