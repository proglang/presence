// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as stackTraceParser from 'stacktrace-parser';

const TOGGLE_DEBUG = "TOGGLE_DEBUG";
const INITIAL_STATE = false;

export const reducer = (state:boolean = INITIAL_STATE, action: any = {}) => {
    switch (action.type) {
        case TOGGLE_DEBUG:
            return action.debug;
        case "TEST":
            return null;
        default:
            return state;
    }
}

export const toggle = (dbg: boolean) => (dispatch: any) => {
    if (dbg === true) {
        localStorage.debug = 1;
        writeMsg('Debug enabled');
    } else {
        writeMsg('Debug disabled');
        localStorage.removeItem('debug');
    }

    const debug = (debug: any) => ({ type: TOGGLE_DEBUG, debug });
    dispatch(debug(dbg));
};

export const isDebug = (): boolean => !!localStorage.debug;

export const writeMsg = (...args: any[]): void => {
    if (isDebug()) {
        var call = '';
        try {
            throw new Error();
        } catch (e) {
            try {
                const st = stackTraceParser.parse(e.stack);
                call = st[1].methodName + '(' + st[1].arguments.join(', ') + ')';
            } catch (e) {
            };
        }
        console.log(
            '%c Debug %s:', 'background: #222; color: #bada55', call,
            args.length > 0 ? '\n' : '', ...args);
    }
}