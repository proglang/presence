
import XLSX from 'xlsx';
import { APP_PATH } from '../settings';

export type TExportHeadType<T> = { k: string | number | ((val: T) => string), t: string }
interface IExporterProps<T> {
    data: T[]
    head: TExportHeadType<T>[]
}
class Exporter<T> implements IExporterProps<T> {
    data: T[] = []
    head: TExportHeadType<T>[] = []
    constructor(data: T[], head: TExportHeadType<T>[]) {
        this.data = data;
        this.head = head;
    }
    private createArray = () => {
        const head = [this.head.map((v) => v.t)]
        const content = this.data.map((value: T) => this.head.map((v) => typeof (v.k) !== 'function' ? Object(value)[v.k] : v.k(value)))
        return head.concat(content)
    }
    private createWorkbook = (name: string) => {
        var wb = XLSX.utils.book_new();
        wb.Props = {
            Title: name,
            Author: APP_PATH,
            CreatedDate: new Date(Date.now())
        };
        wb.SheetNames.push(name);
        const ws = XLSX.utils.aoa_to_sheet(this.createArray())
        wb.Sheets[wb.SheetNames[0]] = ws;
        return wb;
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