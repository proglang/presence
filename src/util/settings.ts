import { useCallback } from "react";

// Copyright (c) 2019 Stefan Schweizer
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// @ts-ignore: Property error
declare var app_config: any;
let data: { [key: string]: any } | null = null;
try {
  data = app_config;
} catch (e) {
}

function getValue<T>(name: string, def: T) {
  if (!data) return def;
  const val = data[name];
  if (val === undefined) return def;
  return val;
}
export const checkConfig = () => data !== null;
export const API_PATH = getValue('api_path', '/api');
export const APP_PATH = getValue('app_path', '/');
