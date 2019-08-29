// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IntlShape } from "react-intl";

export const getDateString = (intl: IntlShape, unix: number) => {
    return intl.formatDate(new Date(unix), { year: "numeric", month: "2-digit", day: "2-digit" })
}
export const getTimeString = (intl: IntlShape, unix: number) => {
    return intl.formatTime(new Date(unix), {
        hour: 'numeric',
        minute: 'numeric'
    })
}

export const getDateTimeString = (intl: IntlShape, unix: number) => {
    return getDateString(intl, unix) + " " + getTimeString(intl, unix);
}

export const parseDateString = (intl: IntlShape, str: string): number => {
    const dateReg = getDateFormat(intl).replace("MM", "(?<month>\\d+)").replace("DD", "(?<day>\\d+)").replace("YYYY", "(?<year>\\d+)")
    const timeReg = getTimeFormat(intl) !== "24" ? "(?<hour>\\d+):(?<min>\\d+) ((?<am>[Aa][Mm])|(?<pm>[Pp][Mm]))" : "(?<hour>\\d+):(?<min>\\d+)"
    const reg = new RegExp(dateReg + " " + timeReg);
    const ret = reg.exec(str)
    if (!ret || !ret.groups) return 0;
    var hour: number = +ret.groups.hour;
    const min: number = +ret.groups.min;
    const day: number = +ret.groups.day;
    const month: number = +ret.groups.month;
    const year: number = +ret.groups.year;

    if (ret.groups.am) hour = hour + 12;

    return (new Date(year, month, day, hour, min)).getTime();
}

export const getDateFormat = (intl: IntlShape) => {
    const isoString = '2018-09-25' // example date!

    const intlString = intl.formatDate(isoString, { year: "numeric", month: "2-digit", day: "2-digit" })
    const dateParts = isoString.split('-') // prepare to replace with pattern parts
    return intlString
        .replace(dateParts[2], 'DD')
        .replace(dateParts[1], 'MM')
        .replace(dateParts[0], 'YYYY')
}
export const getTimeFormat = (intl: IntlShape) => {
    const isoString = '2018-09-25 20:10:00'

    const intlString = intl.formatTime(isoString) // generate a formatted date
    if (intlString.indexOf("20") >= 0) return "24";
    if (intlString.indexOf("AM") >= 0 || intlString.indexOf("PM") >= 0) return "AMPM";
    return "ampm";
}