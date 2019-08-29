// Copyright (c) 2019 Stefan Schweizer
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// @ts-ignore: Property error
declare var app_config: { [key: string]: any } | undefined;
const data = app_config;

function getValue<T>(name: string, def: T) {
  if (!data) return def;
  const val = data[name];
  if (val === undefined) return def;
  return val;
}

export const API_PATH = getValue('api_path', '/api');
export const APP_PATH = getValue('app_path', '/');
