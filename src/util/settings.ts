// Copyright (c) 2019 Stefan Schweizer
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

//@ts-ignore
const data = document.config;

function getValue<T>(name: string, def: T) {
  if (!data) return def;
  const val = data[name];
  if (val === undefined) return def;
  return val;
}

export const API_PATH = getValue('api_path', '/api');
export const APP_PATH = getValue('app_path', '/');
