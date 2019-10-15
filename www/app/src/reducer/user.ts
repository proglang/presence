// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IUserData } from '../api/api.user';

export const RESET = "USER_RESET"
const UPDATE = "USER_UPDATE"

export const _RESET = () => ({ type: RESET });
export const _UPDATE = (data: IUserData) => ({ type: UPDATE, data });

const INITIAL_STATE: IUserData | null = null
export const reducer = (state: IUserData | null = INITIAL_STATE, action: any = {}): IUserData | null => {
    switch (action.type) {
        case UPDATE:
            return action.data;
        case RESET:
            return INITIAL_STATE
        default:
            return state;
    }
}