// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import './Flag.css'

export interface IFlagBorderProps {
  lang: string;
  border: boolean;
  onClick: any;
}

export default class Flag extends React.Component<IFlagBorderProps & any, any> {
  public render() {
    const { lang, border, onClick } = this.props;
    var cl = "flag-icon-background flag-icon-squared flag-border flag-icon-" + lang
    cl = cl + (border ? " active" : "")
    cl = cl + (onClick ? " clickable" : "")
    if (onClick) return <i onClick={onClick} className={cl} />
    return <i className={cl} />
  }
}

export interface IFlagSelectionProps extends React.HTMLAttributes<HTMLDivElement> {
  langs: string[];
  selected?: string;
  columns?: number;
  onClick: (a: any) => any;
}
export class FlagSelection extends React.Component<IFlagSelectionProps> {
  public render() {
    var { columns, langs, onClick } = this.props;
    columns = columns ? columns : 5;
    console.log(this.props)
    return <div
      {...{ ...this.props, langs:undefined,  columns: undefined, onClick: undefined, border: undefined }}
      style={{ ...this.props.style, display: "inline-grid", gridTemplateColumns: "auto ".repeat(columns) }}
    >
      {langs.map((lg: string, index: number) => <Flag key={lg} lang={lg} border={lg === this.props.selected} onClick={(...a: any) => onClick(index)} />)}
    </div>;
  }
}

