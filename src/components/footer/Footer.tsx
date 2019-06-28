// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import LanguageSelect from '../util/LanguageSelect'
export interface IFooterProps {
}

export default class Footer extends React.Component<IFooterProps, any> {
    public render() {
        return (
            <footer className="footer">
                
                <LanguageSelect />
            </footer>
        );
    }
}
