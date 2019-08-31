// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import * as React from 'react';
import { Icon, Table, Input, InputOnChangeData, Responsive } from "semantic-ui-react";
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import TypeChangeInput from '../util/TypeChangeInput';


export type ISortFn1<T> = (key: string | number, val1: T, val2: T) => boolean;
export type ISortFn2<T> = (val1: T, val2: T) => boolean;

export interface IObjectTableHeader<T> {
    k: string | number
    fn?: ((val: T) => [any, boolean])
    t: any
}
export interface IObjectTableProps<T> {
    format?: { [key: number]: {}, [key: string]: {} };
    sortable?: boolean | ISortFn1<T> | { [key: number]: boolean | ISortFn2<T>, [key: string]: boolean | ISortFn2<T> };
    defaultSortCol?: number | string;

    header: IObjectTableHeader<T>[]
    data: { [key: number]: T, [key: string]: T };

    verifier?: { [key: number]: (val: T) => boolean };
    filter?: boolean | { [key: number]: boolean, [key: string]: boolean }

    onSelect?: (entry: T) => void;
    selectKey?: number | string;
    multiSelect?: number;
    selected?: (string | number)[];

    rowPropFn?: ((val: T) => any)
    colPropFn?: ((val: T, key: string | number) => any)
}


export interface IObjectTableState<T> {
    selected: (string | number)[];
    sortCol?: number | string;
    sortDir: "ascending" | "descending"
    filter: { [key: number]: {}, [key: string]: {} };

    currentWidth: number;
}

class _TextWrapper extends React.Component<{ id: string } & WrappedComponentProps> {
    public render() {
        return <FormattedMessage id={this.props.id} />
    }
}
const TextWrapper = injectIntl(_TextWrapper);

export default class ObjectTable<T> extends React.Component<IObjectTableProps<T>, IObjectTableState<T>> {
    constructor(props: IObjectTableProps<T>) {
        super(props);
        this.state = {
            filter: {},
            sortDir: "ascending",
            selected: [],
            currentWidth: 0,
        }
    }
    componentDidMount = () => {
        const { header, sortable, defaultSortCol } = this.props;
        const { filter: sortCol } = this.state;
        if (sortable) {
            if (sortCol === undefined) {
                if (defaultSortCol) {
                    this.setState({ sortCol: defaultSortCol });
                } else if (typeof (sortable) === "object") {
                    const key = Object.keys(sortable)[0]
                    this.setState({ sortCol: key });
                } else {
                    const key = Object.values(header).find((val) => typeof (val.k) !== "string");
                    if (!key || typeof (key.k) !== "string") {
                        throw new Error("No key for search found!");
                    }
                    this.setState({ sortCol: key.k })
                }
                return (null);
            }
        }

    }
    componentDidUpdate = (props: IObjectTableProps<T>) => {
        if (this.props.selected !== props.selected)
            this.setState({ selected: this.props.selected ? this.props.selected : [] })
    }
    handleSort = (col: string | number | null) => {
        if (col === null) return;
        const { sortable } = this.props;
        if (!sortable) return;
        if (typeof (sortable) === 'object') {
            if (!sortable[col]) return;
        }
        var { sortCol, sortDir } = this.state
        if (sortCol === col) {
            sortDir = (sortDir === 'ascending') ? 'descending' : 'ascending';
        } else {
            sortDir = 'ascending';
        }
        this.setState({ sortCol: col, sortDir })
    }

    OnFilterChange = (key: string | number) => (e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        this.SetFilter(key, data.value);
    }
    SetFilter = (key: string | number | null, value: string = "") => {
        if (key === null) return;
        var { filter } = this.state;
        if (value === "") {
            delete filter[key];
        } else {
            filter[key] = value;
        }
        this.setState({ filter })

    }
    onSelect = (data: T) => {
        if (!this.props.selectKey) return;
        const arr = this.state.selected;
        const num = this.props.multiSelect
        arr.push(Object(data)[this.props.selectKey])
        if (arr.length > (num ? num : 1)) {
            arr.shift()
        }
        if (this.props.onSelect)
            this.props.onSelect(data);
        this.setState({ selected: arr })
    }
    public render() {
        //@ts-ignore
        const mobile = Responsive.onlyComputer.minWidth > this.state.currentWidth;

        const { data, header, sortable, filter, selectKey } = this.props;
        const { filter: filterState, sortCol, sortDir } = this.state;
        const filterVal = Object(filterState);

        let filtered: any[] = [];
        if (!mobile) {
            filtered = Object.values(data).filter((value: T) =>
                Object.keys(filterState).every((key: string) =>
                    key === "global" || String(Object(value)[key]).toLowerCase().includes(String(filterState[key]).toLowerCase())));
        } else {
            filtered = Object.values(data).filter((value: T) =>
                !filterState["global"] || !filter || header.some(({ k: _key }) => {
                    const key = (typeof (_key) === "string" || typeof (_key) === "number") ? _key : null;
                    const show = (key && (filter === true || filter[_key])) === true
                    if (show && key) {
                        return String(Object(value)[_key]).toLowerCase().includes(String(filterState["global"]).toLowerCase())
                    }
                    return false;
                }
                )
            )

        }

        if (sortable && sortCol) {
            let sortfn = typeof (sortable) === 'function' ? ((a: T, b: T) => sortable(sortCol, a, b)) : null;
            sortfn = sortable === true ? ((a, b) => Object(a)[sortCol] <= Object(b)[sortCol]) : sortfn;
            if (sortfn === null) {
                const val: boolean | undefined | ISortFn2<T> = Object(sortable)[sortCol];
                sortfn = typeof (val) === 'function' ? val : null;
                sortfn = val === true ? ((a, b) => Object(a)[sortCol] <= Object(b)[sortCol]) : null
            }
            if (sortfn !== null) {
                const fn = sortfn;
                filtered.sort((a: T, b: T) => fn(a, b) ? -1 : 1)
                if (sortDir === 'descending')
                    filtered.reverse()
            }
        }
        return ([
            <Responsive key="1" fireOnMount onUpdate={(_, data: any) => this.setState({ currentWidth: data.width })} />,
            <Table key="2" celled striped sortable={!!sortable}>
                <Table.Header>
                    {!!filter &&
                        <Table.Row>
                            {!mobile && header.map((val, index) => {
                                const key = (typeof (val.k) === "string" || typeof (val.k) === "number") ? val.k : null;
                                const show = (key && (filter === true || filter[key])) === true
                                return <Table.HeaderCell key={index} style={{ padding: 0 }}>
                                    {(show && key) &&
                                        <Input
                                            fluid
                                            key={index}

                                            type="text"
                                            onChange={this.OnFilterChange(key)}
                                            value={filterVal[key]}
                                            icon={filterVal[key] ? <Icon name='delete' link onClick={() => {
                                                this.SetFilter(key, "");
                                            }}
                                            /> : null}
                                        />
                                    }
                                </Table.HeaderCell>
                            })}
                            {mobile &&
                                <Table.HeaderCell style={{ padding: 0 }} colSpan={header.length}>
                                    <TypeChangeInput
                                        fluid
                                        onChange={this.OnFilterChange("global")}
                                        value={filterVal["global"]}
                                        icon={filterVal["global"] ? <Icon name='delete' link onClick={() => {
                                            this.SetFilter("global", "");
                                        }}
                                        /> : null}
                                    />
                                </Table.HeaderCell>
                            }
                        </Table.Row>
                    }
                    {!mobile && <Table.Row>
                        {header.map((data, index) => {
                            const key = (typeof (data.k) === "string" || typeof (data.k) === "number") ? data.k : null;
                            const text = typeof (data.t) !== "string" ? data.t : <TextWrapper key={index} id={data.t} />;
                            return (
                                <Table.HeaderCell
                                    sorted={sortCol === key ? sortDir : undefined}
                                    onClick={() => this.handleSort(key)}
                                    key={index}
                                >
                                    {text}
                                </Table.HeaderCell>
                            )
                        })}
                    </Table.Row>}
                </Table.Header>
                <Table.Body>
                    {filtered.map((row, row_id) => {
                        const r = (<Table.Row
                            key={row_id}
                            active={selectKey && this.state.selected.find((val) => val === Object(row)[selectKey]) ? true : false}
                        >
                            {header.map((data, index) => {
                                const [val, sel] = !data.fn ? [Object(row)[data.k], true] : data.fn(row)
                                const c = (<Table.Cell
                                    collapsing={!!data.fn}
                                    key={index}
                                    onClick={(selectKey && sel !== false) ? (() => this.onSelect(row)) : null}
                                >
                                    {val}
                                </Table.Cell>)

                                if (this.props.colPropFn) {
                                    const tsnode = c as React.ReactElement<any>;
                                    if (tsnode === null) return null;
                                    const { validator, ...childProps } = tsnode.props;
                                    const nprop = this.props.colPropFn(row, data.k)
                                    if (typeof (nprop) === 'object')
                                        return React.createElement(tsnode.type, { key: index, ...childProps, ...nprop })
                                }
                                return c;
                            })
                            }
                        </Table.Row>)
                        if (this.props.rowPropFn) {
                            const tsnode = r as React.ReactElement<any>;
                            if (tsnode === null) return null;
                            const { validator, ...childProps } = tsnode.props;
                            const nprop = this.props.rowPropFn(row)
                            if (typeof (nprop) === 'object')
                                return React.createElement(tsnode.type, { key: row_id, ...childProps, ...nprop })
                        }
                        return r;
                    }
                    )}
                </Table.Body>
            </Table>
        ]);
    }
}