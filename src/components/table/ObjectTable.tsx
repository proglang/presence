
import * as React from 'react';
import { Icon, Table, Input, InputOnChangeData } from "semantic-ui-react";


export interface IObjectTableProps<T> {
    format?: { [key: number]: {}, [key: string]: {} };
    sortable?: boolean | { [key: number]: boolean, [key: string]: boolean };
    defaultSortCol?: number | string;

    header: { k: string | number | ((val: T) => any), t: string }[]
    data: { [key: number]: T, [key: string]: T };

    verifier?: { [key: number]: (val: T) => boolean };
    filter?: boolean | { [key: number]: boolean, [key: string]: boolean }

    onSelect?: (entry: T) => void;
    selectKey?: number | string;
    multiSelect?: number;
    selected?: (string | number)[];
}


export interface IObjectTableState<T> {
    selected: (string | number)[];
    sortCol?: number | string;
    sortDir: "ascending" | "descending"
    filter: { [key: number]: {}, [key: string]: {} };
}

export default class ObjectTable<T> extends React.Component<IObjectTableProps<T>, IObjectTableState<T>> {
    constructor(props: IObjectTableProps<T>) {
        super(props);
        this.state = {
            filter: {},
            sortDir: "ascending",
            selected: []
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
        if (!this.props.sortable) return;
        if (!this.props.sortable && !this.props.sortable[col]) return;
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
        const { data, header, sortable } = this.props;
        const { filter: filterState, sortCol, sortDir } = this.state;
        const filterVal = Object(filterState);
        const filtered = Object.values(data).filter((value: T) =>
            Object.keys(filterState).every((key: string) =>
                String(Object(value)[key]).includes(String(filterState[key]))));
        if (sortable && sortCol) {
            filtered.sort((a, b) => (Object(a)[sortCol] <= Object(b)[sortCol]) ? -1 : 1)
            if (sortDir === 'descending')
                filtered.reverse()
        }
        const filter = this.props.filter
        const selectKey = this.props.selectKey
        return (
            <Table celled striped sortable={!!sortable}>
                <Table.Header>
                    {!!filter &&
                        <Table.Row>
                            {header.map((val, index) => {
                                const key = (typeof (val.k) === "string" || typeof (val.k) === "number") ? val.k : null;
                                const show = (key && (filter === true || filter[key])) === true
                                return <Table.HeaderCell key={index} style={{ padding: 0 }}>
                                    {(show && key) &&
                                        <Input
                                            fluid
                                            index={index}
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
                        </Table.Row>
                    }
                    <Table.Row>
                        {header.map((data, index) => {
                            const key = (typeof (data.k) === "string" || typeof (data.k) === "number") ? data.k : null;
                            return (
                                <Table.HeaderCell
                                    sorted={sortCol === key ? sortDir : undefined}
                                    onClick={() => this.handleSort(key)}
                                    key={index}
                                >
                                    {data.t}
                                </Table.HeaderCell>
                            )
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filtered.map((row, row_id) =>
                        <Table.Row
                            key={row_id}
                            active={selectKey && this.state.selected.find((val) => val === Object(row)[selectKey]) ? true : false}
                            onClick={selectKey && (() => this.onSelect(row))}
                        >
                            {header.map((data, index) =>
                                <Table.Cell
                                    collapsing={!(typeof (data.k) === "string" || typeof (data.k) === "number")}
                                    key={index}
                                >
                                    {
                                        (typeof (data.k) === "string" || typeof (data.k) === "number") ? Object(row)[data.k] : data.k(row)
                                    }
                                </Table.Cell>)
                            }
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}
