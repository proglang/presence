// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Icon, Table, Input, InputOnChangeData } from "semantic-ui-react";

export interface IFilterTableProps {
  showErrCol?: boolean;
  showOverflowData?: boolean;
  format?: {[key:number]:{}};
  sortable?: {[key:number]:boolean}
  header: any[];
  data: any[][];
  verifier?: { [key: number]: (val: any) => boolean };
  filter?: boolean | { [key: number]: boolean }
  onClick?: (row: number, col: number) => void;
  onHover?: (row: number, col: number, enter: boolean) => void;
}

type TableStyle = 'err' | 'valid' | 'warning'
type TableFilter = string[]
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
  filter: TableFilter;
  filterUpdate?: boolean;
}
export default class FilterTable extends React.Component<IFilterTableProps, IFilterTableState> {
  constructor(props: IFilterTableProps) {
    super(props);

    var filter: string[] = [];
    filter.length = props.header.length;
    filter.fill("")
    this.state = {
      data: [],
      filter,
      filterUpdate: true
    }
    this.componentWillUpdate(props, this.state);
  }
  setStateData = (props: IFilterTableProps) => {
    const { data, header, verifier } = props;
    var statedata: any = []
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
      statedata.push({ row: rowData, index: index, err: has_err ? err : undefined })
    })
    return statedata
  }

  public componentWillReceiveProps() {
    this.setState({ filterUpdate: true });
  }
  public componentWillUpdate(nextProps: any, nextState: any) {
    if (nextState.filterUpdate) {
      nextState.data = this.setStateData(nextProps);
      nextState.data = this.filterTable(nextState)
      nextState.sortUpdate = true;
    }
    if (nextState.sortUpdate) {
      var { data, sortCol, sortDir } = nextState
      if (sortCol !== undefined) {
        const scol = this.getSortColID(sortCol);
        data.sort((a: IFilterTableStateData, b: IFilterTableStateData): number => this.getValue(a.row[scol]) > this.getValue(b.row[scol]) ? 1 : -1)
        if (sortDir === 'descending') data.reverse();
        nextState.data = data;
      }
    }
    nextState.sortUpdate = false;
    nextState.filterUpdate = false;

  }
  getValue = (data: any) => {
    var ret: string = "";
    if (typeof (data) === "object") {
      if (data.props && data.props.children) {
        ret = ret + this.getValue(data.props.children);
      }
      Object.values(data).forEach((val: any) => {
        if (val && val.props && val.props.children) {
          ret = ret + this.getValue(val.props.children);
        }
      })
    } else {
      ret = String(data);
    }
    return ret;
  }

  filterTable = (state: IFilterTableState) => {
    var { data: table, filter } = state;
    Object.entries(filter).forEach(([col, filterval]: any) => {
      if (filterval === "") return;
      table = table.filter((value: IFilterTableStateData) => {
        const coldata = this.getValue(value.row[col]);
        return coldata.toLowerCase().includes(filterval.toLowerCase())
      })
    })
    return table
  }

  getSortColID = (col: number) => {
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

  handleSort = (col: number) => {

    if (this.props.sortable && !this.props.sortable[col]) return;
    var { sortCol, sortDir } = this.state
    if (sortCol === col) {
      sortDir = sortDir === 'ascending' ? 'descending' : 'ascending';
    } else {
      sortDir = 'ascending';
    }
    this.setState({ sortUpdate: true, sortCol: col, sortDir })
  }

  OnFilterChange = (e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    var { filter } = this.state;
    filter[data.index] = data.value;
    this.setState({ filter, filterUpdate: true })
  }
  public render() {
    const { showErrCol, showOverflowData, header, onClick,onHover, filter } = this.props;
    const { data, sortCol, sortDir, filter: filterVal } = this.state;
    var colcount = header.length + (showOverflowData ? 1 : 0) + (showErrCol ? 1 : 0);
    colcount = colcount <= 0 ? 1 : colcount > 16 ? 16 : colcount
    return (
      <Table celled striped sortable>
        <Table.Header>
          {!!filter &&
            <Table.Row>
              {header.map((val, index) => {
                const show = filter === true || filter[index] === true
                return <Table.HeaderCell key={index} style={{ padding: 0 }}>
                  {show &&
                    <Input
                      fluid
                      index={index}
                      type="text"
                      onChange={this.OnFilterChange}
                      value={filterVal[index]}
                      icon={filterVal[index] ? <Icon name='delete' link onClick={() => {
                        filterVal[index] = "";
                        this.setState({ filter: filterVal, filterUpdate: true })
                      }}
                      /> : null}
                    />
                  }
                </Table.HeaderCell>

              })}
            </Table.Row>
          }
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
                  const fg = this.props.format
                  const f:{[key:string]:any} = fg?(fg[col_id]?fg[col_id]:{}):{};
                  return (
                    <Table.Cell
                      {...f}
                      onClick={() => onClick && onClick(row.index, col_id)}
                      onMouseEnter={() => onHover && onHover(row.index, col_id, true)}
                      onMouseLeave={() => onHover && onHover(row.index, col_id, false)}
                      selectable={!!onClick}
                      collapsing={col_id===colcount-1 || !!f.collapsing}
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
        {data.length !== this.props.data.length &&
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={colcount}>
                <p>{data.length}/{this.props.data.length}</p>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>}
      </Table>
    );
  }
}
