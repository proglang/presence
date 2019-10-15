// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import XLSX from 'xlsx';
import { APP_NAME } from '../settings';

export type TExportHeadType<T> = { k: string | number | ((val: T) => string), t: string }
interface IExporterProps<T> {
    data: T[]
    head: TExportHeadType<T>[]
}

export interface ISheet {
    data: XLSX.WorkSheet
    name: string
}

class Exporter<T> implements IExporterProps<T> {
    data: T[] = []
    head: TExportHeadType<T>[] = []
    constructor(data: T[], head: TExportHeadType<T>[]) {
        this.data = data;
        this.head = head;
    }
    static mergeSheets = (name: string, ...sheets:ISheet[]) => {
        var wb = XLSX.utils.book_new();
        wb.Props = {
            Title: name,
            Author: APP_NAME,
            CreatedDate: new Date(Date.now())
        };
        sheets.forEach((val)=> {
            wb.SheetNames.push(val.name);
            wb.Sheets[val.name] = val.data;
        })
        return wb;
    }
    private createArray = () => {
        const head = [this.head.map((v) => v.t)]
        const content = this.data.map((value: T) => this.head.map((v) => typeof (v.k) !== 'function' ? Object(value)[v.k] : v.k(value)))
        return head.concat(content)
    }
    public toSheet = (name: string):ISheet => {
        const ws = XLSX.utils.aoa_to_sheet(this.createArray())
        return {data: ws, name}
    }
    private createWorkbook = (name: string) => {
        return Exporter.mergeSheets(name, this.toSheet(name))
    }

    static toCSV = (filename: string, ...sheets:ISheet[]) => {
        XLSX.writeFile(Exporter.mergeSheets(filename, ...sheets), `${filename}.csv`)
    }
    static toXLS = (filename: string, ...sheets:ISheet[]) => {
        XLSX.writeFile(Exporter.mergeSheets(filename, ...sheets), `${filename}.xls`)
    }
    static toXLSX = (filename: string, ...sheets:ISheet[]) => {
        XLSX.writeFile(Exporter.mergeSheets(filename, ...sheets), `${filename}.xlsx`)
    }
    toCSV = (filename: string) => {
        XLSX.writeFile(this.createWorkbook(filename), `${filename}.csv`)
    }
    toXLS = (filename: string) => {
        XLSX.writeFile(this.createWorkbook(filename), `${filename}.xls`)
    }
    toXLSX = (filename: string) => {
        XLSX.writeFile(this.createWorkbook(filename), `${filename}.xlsx`)
    }
    /* toJSON = (filename: string) => {
        XLSX.writeFile(this.createWorkbook(filename), `${filename}.json`)
    }*/
}

export default Exporter