// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as stackTraceParser from 'stacktrace-parser'

const TOGGLE_DEBUG = "TOGGLE_DEBUG";

export const reducer = (state: boolean = isDebug(), action: any = {}) => {
    switch (action.type) {
        case TOGGLE_DEBUG:
            return action.debug;
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

const getStackTrace = ( index: number = 2) => {
    var call = '';
    try {
        throw new Error();
    } catch (e) {
        try {
            const st = stackTraceParser.parse(e.stack);
            call = st[index].methodName + '(' + st[index].arguments.join(', ') + ')';
        } catch (e) {
        };
    }
    return call;
}
export const trace = (file: string, name?:string) => {
    if (isDebug()) {
        console.log(
            '%c Trace %s: %s', 'background: #222; color: #ff0a55', !!name?name:getStackTrace(), file)
    }
}
export const writeMsg = (...args: any[]): void => {
    if (isDebug()) {
        console.log(
            '%c Debug %s:', 'background: #222; color: #bada55', getStackTrace(),
            args.length > 0 ? '\n' : '', ...args);
    }
}