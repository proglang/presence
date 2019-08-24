type ValidateReturn = true | string;
const validateLength = (name: string, str: string, length: number = 1) => {
    return str.length >= length ? true : `error.${name}.length.${length}`;
}

export const name = (str: string): ValidateReturn => {
    const vl = validateLength('name', str, 5)
    if (vl !== true) return vl;
    return true;
}
export const password = (str: string): ValidateReturn => {
    const vl = validateLength('password', str, 10)
    if (vl !== true) return vl;
    return true;
}
export const password2 = (str: string, str2: string): ValidateReturn => {
    return str === str2 ? true : "error.password.same"
}
export const email = (str: string): ValidateReturn => {
    const vl = validateLength('email', str, 5)
    if (vl !== true) return vl;
    return true;
}

export const date = (date: number): ValidateReturn => {
    return date!==0?true:"error.date";
}
export const exam_name = (str: string): ValidateReturn => {
    const vl = validateLength('exam', str, 5)
    if (vl !== true) return vl;
    return true;
}