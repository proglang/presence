// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import LanguageSelect from '../util/LanguageSelect'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Container } from 'semantic-ui-react';

export interface IConfigPageProps {
}

export default class ConfigPage extends React.Component<IConfigPageProps, any> {
    public render() {
        return (
            <Container as="main">
                <section>
                    <h3><FormattedMessage id="test.lang" /></h3>
                    <LanguageSelect />
                </section>
            </Container>
        );
    }
}