// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import React from 'react';
import { Form, FormInputProps } from 'semantic-ui-react';

interface IValidationInputFieldProps extends FormInputProps {
    validator?: () => string | true;
}
export default class ValidationInputField extends React.Component<IValidationInputFieldProps> {
    public render() {
        return (
            <Form.Input {...this.props} validator={null} />
        )
    }
}