// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Icon, Table, Input, InputOnChangeData } from "semantic-ui-react";

// Todo: Filter
export interface IFilterTableProps {
  showErrCol?: boolean;
  showOverflowData?: boolean;
  header: any[];
  data: any[][];
  verifier?: { [key: number]: (val: any) => boolean };
  filter?: boolean | { [key: number]: boolean | ((val: any) => boolean) }
  onClick?: (row: number, col: number) => void;
  onHover?: (row: number, col: number, enter: boolean) => void;
}

type TableStyle = 'err' | 'valid' | 'warning'
type TableFilter = { [key: number]: string }
interface IFilterTableStateData {
  row: any[]
  index: number
  err?: TableStyle[]
}
export interface IFilterTableState {
  data: IFilterTableStateData[];
  sortCol?: number;
  sortDir?: "ascending" | "descending"
  sortUpdate?: boolean;
  filter?: TableFilter;
  filterUpdate?: boolean;
}
export default class FilterTable extends React.Component<IFilterTableProps, IFilterTableState> {
  constructor(props: IFilterTableProps) {
    super(props);

    this.state = {
      data: []
    }
    this.setStateData();
  }
  setStateData = () => {
    const { data, header, verifier } = this.props;
    this.state.data.splice(0, this.state.data.length); // clear state data;

    data.forEach((row, index) => {
      var rowData: any[];
      var err: TableStyle[] = [];
      var has_err = false;

      // data
      const vdata = row.slice(0, header.length)
      vdata.forEach((col, index) => {
        err[index] = (verifier && verifier[index] && !verifier[index](col)) ? 'err' : 'valid';
        has_err = has_err || err[index] === 'err';
      })
      rowData = vdata;

      // superfluous data
      if (this.props.showOverflowData) {
        const edata = row.slice(header.length);
        err.push(edata.length > 0 ? 'warning' : 'valid')
        has_err = has_err || edata.length > 0
        rowData.push(edata.map((col, index) => <p key={index}>{col}</p>));
      }
      if (this.props.showErrCol) {
        rowData.push(has_err ? <Icon name='attention' /> : <Icon color='green' name='checkmark' />)
      }
      // set data:
      this.state.data.push({ row: rowData, index: index, err: has_err ? err : undefined })
    })
  }

  filterTable = () => {
    const {filter, filterUpdate} = this.state;
    if (!filter || !filterUpdate) return;
    this.setStateData();
    var table = this.state.data;
    Object.entries(filter).forEach(([col, filterval]:any) => {
      table = table.filter((value: IFilterTableStateData, index: number) => {
        const coldata = value.row[col];
        // Todo: Recursive through multiple levels
        if (typeof (coldata) === "object") {
          try {
            // Todo: Change this to another method which doesn't require throw!
            Object.values(coldata).forEach((val: any) => {
              if (val.props && val.props.children) {
                if (String(val.props.children).toLowerCase().includes(filterval.toLowerCase()))
                  throw (new Error())
              }
            });
          } catch{ return true; }
        } else {
          return String(coldata).toLowerCase().includes(filterval.toLowerCase())
        }
        return false;
      })
    })
    this.setState({ data: table, filterUpdate:false, sortUpdate:true })
  }

  getSortCol = (col: number) => {
    var scol = col;
    if (scol < 0) {
      // superfluous data
      if (col === -1) {
        scol = this.props.header.length
      }
      // error col
      if (col === -2) {
        if (this.props.showOverflowData) {
          scol = this.props.header.length + 1
        } else {
          scol = this.props.header.length
        }
      }
    }
    return scol;
  }
  doSort = () => {
    var { data, sortCol, sortDir, sortUpdate } = this.state
    if (sortCol!==undefined && sortUpdate) {
      const scol = this.getSortCol(sortCol);
      data.sort((a: IFilterTableStateData, b: IFilterTableStateData): number => a.row[scol] > b.row[scol] ? 1 : -1)
      if (sortDir === 'descending') data.reverse();
      this.setState({ data, sortUpdate:false })
    }
  }
  handleSort = (col: number) => {
    var { sortCol, sortDir } = this.state
    if (sortCol === col) {
      sortDir = sortDir === 'ascending' ? 'descending' : 'ascending';
    } else {
      sortDir = 'ascending';
    }
    this.setState({ sortUpdate: true, sortCol: col, sortDir })
  }

  OnFilterChange = (e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    const { filter } = this.state;
    this.setState({ filter: { ...filter, [data.index]: data.value }, filterUpdate: true })
  }
  public render() {
    const { showErrCol, showOverflowData, header, onClick } = this.props;
    const { data, sortCol, sortDir } = this.state;
    this.filterTable()
    this.doSort();
    return (
      <Table celled striped sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Input index={0} type="text" onChange={this.OnFilterChange} />
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {header.map((data, index) => <Table.HeaderCell sorted={sortCol === index ? sortDir : undefined} onClick={() => this.handleSort(index)} key={index}>{data}</Table.HeaderCell>)}
            {showOverflowData && <Table.HeaderCell sorted={sortCol === -1 ? sortDir : undefined} onClick={() => this.handleSort(-1)}>__LOCA__ SUPERFLUOUS</Table.HeaderCell>}
            {showErrCol && <Table.HeaderCell sorted={sortCol === -2 ? sortDir : undefined} onClick={() => this.handleSort(-2)}>__LOCA__ ERR?</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((row: IFilterTableStateData, row_id) => {
            return (
              <Table.Row key={row_id} warning={!!row.err}>
                {row.row.map((col: any, col_id: number) => {
                  return (
                    <Table.Cell
                      onClick={() => onClick && onClick(row.index, col_id)}
                      selectable={!!onClick}
                      key={col_id}
                      error={row.err && row.err[col_id] === 'err'}
                      warning={row.err && row.err[col_id] === 'warning'}>
                      {col}
                    </Table.Cell>
                  )
                })}
              </Table.Row>)
          })}
        </Table.Body>
      </Table>
    );
  }
}
