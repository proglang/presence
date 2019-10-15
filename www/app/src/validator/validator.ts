// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface IValidationErrorMsg {
    id: string,
    args?: { [key: string]: number | string }
}
type ValidateReturn = true | IValidationErrorMsg;

const validateMinLength = (name: string, str: string, length: number = 1): ValidateReturn => {
    return str.length >= length ? true : { id: `validation.${name}.min`, args: { count: length } };
}

export const name = (str: string): ValidateReturn => {
    const vl = validateMinLength('name', str, 5)
    if (vl !== true) return vl;
    return true;
}
export const password = (str: string): ValidateReturn => {
    const vl = validateMinLength('password', str, 10)
    if (vl !== true) return vl;
    return true;
}
export const password2 = (str: string, str2: string): ValidateReturn => {
    return str === str2 ? true : { id: "validation.password.same" }
}
export const email = (str: string): ValidateReturn => {
    const vl = validateMinLength('email', str, 5)
    if (vl !== true) return vl;
    return true;
}

export const date = (date: number): ValidateReturn => {
    return date !== 0 ? true : { id: "validation.date" };
}
export const exam_name = (str: string): ValidateReturn => {
    const vl = validateMinLength('exam', str, 5)
    if (vl !== true) return vl;
    return true;
}