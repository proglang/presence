// Copyright (c) 2019 Stefan Schweizer
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import XLSX from 'xlsx';

export default class {
  static sheet2arr = (sheet: XLSX.WorkSheet): any[] => {
     if (sheet["!ref"]===undefined) throw(new Error('!ref must be set!'));
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      row = [];
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: colNum})];
        if (typeof nextCell === 'undefined') {
          row.push(void 0);
        } else
          row.push(nextCell.v);
      }
      result.push(row);
    }
    return result;
  };

  static readSheet(file: File):Promise<any[]> {
   return new Promise((resolve, reject) => {
     const t = new FileReader();
     const s2a = this.sheet2arr
     t.onload = function(e: any) {
       try {
         var data = new Uint8Array(e.target.result);
         var workbook = XLSX.read(data, {type: 'array'});
         const sheet = workbook.Sheets[workbook.SheetNames[0]];
         return resolve(s2a(sheet));
       } catch (e) {
         reject(e);
       }
     };
     t.readAsArrayBuffer(file);
   })
 }
 static readJSON(file: File) {
   return new Promise((resolve, reject) => {
     const t = new FileReader();
     t.onload = function(e: any) {
       try {
         return resolve(JSON.parse(e.target.result));
       } catch (e) {
         reject(e);
       }
     };
     t.readAsText(file);
   })
 }
}
