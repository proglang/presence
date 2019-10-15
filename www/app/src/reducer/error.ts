// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


const RESET = "ERROR_RESET"
const SET = "ERROR_SET"

export const _RESET = () => ({ type: RESET });
export const _SET = (data: string) => ({ type: SET, data });

export type TError = string | null;

const INITIAL_STATE: TError = null;
export const reducer = (state: TError = INITIAL_STATE, action: any = {}): TError => {
    switch (action.type) {
        case SET:
            return action.data
        case RESET:
            return INITIAL_STATE
        default:
            return state;
    }
}