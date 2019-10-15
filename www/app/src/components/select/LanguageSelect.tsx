// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as Flag from './Flag'

import {  injectIntl,  WrappedComponentProps } from 'react-intl';
import * as loca from "../../loca/loca";
import { connect, DispatchProp } from 'react-redux';

export interface ILanguageSelectProps  {
}

class LanguageSelect extends React.Component<ILanguageSelectProps & DispatchProp & WrappedComponentProps, any> {
    update = (lang: string) => loca.update(lang)(this.props.dispatch);
    onChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
        this.update(data.value)
    }
    public render() {
        const lang = this.props.intl.locale;
        const langs = loca.getAvailableLanguages();
        if (lang.length > 5) {
            return (
                <Dropdown
                    onChange={this.onChange}
                    defaultValue={lang}
                    selection
                    pointing
                    options={
                        langs.map(lang => {return {
                            key: lang,
                            text: this.props.intl.formatMessage({ id: "loca." + lang }),
                            value: lang,
                            flag: loca.getFlag(lang)
                        }})
                    }
                />
            );
        }
        return <Flag.FlagSelection
            style={{width: 30*langs.length}}
            columns={langs.length}
            selected={loca.getFlag(lang)}
            langs={langs.flatMap((val: string) => loca.getFlag(val))}
            onClick={(index:number)=>this.update(langs[index])} />
    }
}
export default connect()(injectIntl(LanguageSelect));