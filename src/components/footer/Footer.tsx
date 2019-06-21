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
            <footer style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "black", color: "white", minHeight: "2em", textAlign: "right" }}>
                
                <LanguageSelect />
            </footer>
        );
    }
}
