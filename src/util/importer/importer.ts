// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import XLSX from 'xlsx';

export type TImportHeadType = { index: number, key: string | number, fn?: ((val: string) => any) }

interface IImporterProps {
    head: TImportHeadType[]
    startRow: number
}
class Importer<T> implements IImporterProps {
    head: TImportHeadType[] = []
    startRow: number = 0;
    constructor(head: TImportHeadType[], startRow: number = 0) {
        this.head = head;
        this.startRow = startRow
    }
    private sheet2arr = (sheet: XLSX.WorkSheet): any[][] => {
        if (sheet["!ref"] === undefined) throw (new Error('!ref must be set!'));
        var result = [];
        var row;
        var rowNum;
        var colNum;
        var range = XLSX.utils.decode_range(sheet['!ref']);
        for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            row = [];
            for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
                var nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
                if (typeof nextCell === 'undefined') {
                    row.push(void 0);
                } else
                    row.push(nextCell.v);
            }
            result.push(row);
        }
        return result;
    };
    fromFile = (file: File, callback: (val: T[] | null) => any) => {
        const t = new FileReader();
        t.onload = (e: any) => {
            try {
                var workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = this.sheet2arr(sheet);
                const ret = data.map((value, rowIndex) => {
                    if (rowIndex < this.startRow) return null;
                    return this.head.reduce((prev, cur) => ({ ...prev, [cur.key]: cur.fn ? cur.fn(value[cur.index]) : value[cur.index] }), {})
                }).filter((val) => val !== null)
                //@ts-ignore
                callback(ret);
            } catch (e) {
                callback(null);
            }
        };
        t.readAsArrayBuffer(file);
    }
}

export default Importer