// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import { Icon, Table } from "semantic-ui-react";

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

interface IFilterTableStateData {
  row: any[]
  index: number
  err?: boolean[]
}
export interface IFilterTableState {
  data: IFilterTableStateData[];
  sort_col?: number;
  sort_dir?: "ascending" | "descending"
}

export default class FilterTable extends React.Component<IFilterTableProps, IFilterTableState> {
  constructor(props: IFilterTableProps) {
    super(props);

    this.state = {
      data: [],
    }
    const { data, header, verifier } = props;
    data.forEach((row, index) => {
      var err: any = [];
      var has_err = false;
      row.slice(0,header.length).forEach((col, index) => {
        err[index] = (verifier && verifier[index]) ? !verifier[index](col) : false;
        has_err = has_err || err[index];
      })
      if (!has_err) err = header.length < row.length;
      var data = { row, index: index, err };
      this.state.data.push(data)
    })
  }
  handleSort = (col: number) => {
    console.log(col);
    var { data,sort_col,sort_dir } = this.state
    if (sort_col===col) {
      sort_dir = sort_dir==='ascending'?'descending':'ascending';
      data.reverse()
    }else{
      sort_dir = 'ascending';
      data.sort((a: IFilterTableStateData, b: IFilterTableStateData): number => a.row[col] > b.row[col] ? -1 : 1)
    }
    this.setState({data, sort_col: col, sort_dir})
  }

  public render() {
    const { showErrCol, showOverflowData, header, onClick } = this.props;
    const { data, sort_col, sort_dir } = this.state;
    return (
      <Table celled striped sortable>
        <Table.Header>
          <Table.Row>
            {header.map((data, index) => <Table.HeaderCell sorted={sort_col === index ? sort_dir : undefined} onClick={()=>this.handleSort(index)} key={index}>{data}</Table.HeaderCell>)}
            {showOverflowData && <Table.HeaderCell></Table.HeaderCell>}
            {showErrCol && <Table.HeaderCell></Table.HeaderCell>}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((row: IFilterTableStateData, row_id) => {
            return (
              <Table.Row key={row_id} warning={!!row.err}>
                {row.row.slice(0, header.length).map((col: any, col_id: number) => {
                  return (
                    <Table.Cell
                      onClick={() => onClick && onClick(row.index, col_id)}
                      selectable={!!onClick}
                      key={col_id}
                      negative={row.err && row.err[col_id]}>
                      {col}
                    </Table.Cell>
                  )
                })}
                {showOverflowData &&
                  <Table.Cell error={header.length < row.row.length}>
                    {row.row.slice(header.length).map((col, col_id) => <p key={col_id}>{col}</p>)}
                  </Table.Cell>
                }
                {showErrCol &&
                  <Table.Cell error={!!row.err} collapsing>
                    {!!row.err ? <Icon name='attention' /> : <Icon color='green' name='checkmark' />}
                  </Table.Cell>
                }
              </Table.Row>)
          })}
        </Table.Body>
      </Table>
    );
  }
}
