// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { updateIntl } from 'react-intl-redux'

// Localization

import messages_de from "./data/de.json";
import messages_en from "./data/en.json";

import 'moment/locale/de';

// Localization
const defaultLang = "en";
const messages: {[key:string]: {[key:string]:string}} = {
    en: messages_en,
   de: messages_de
}
const images:{[key:string]:string} = {
    en: 'gb'
}

/// switch Language and update redux state
export const update = (lang:string) => (dispatch:any) => {
  const [lg, msg] = getLocale(lang);
  dispatch(updateIntl({locale: lg, messages: msg }));
};

export const init = () => (dispatch:any) =>  {
    update('en')(dispatch); // Todo: Use Saved Language #9
}
export function getAvailableLanguages(): string[] {
    return Object.keys(messages);
}

export function getLocale(lang:string):[string, {[key:string]:string}] {
    var msg = messages[lang];
    if (!msg) {
        lang = defaultLang;
        msg = messages[lang];
    }
    return [lang, messages[lang]];
}

export function getFlag(lang:string):string {
    const img =  images[lang];
    if (img) return img;
    return lang;
}