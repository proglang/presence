import * as React from 'react';
import { Input, InputProps, Button } from 'semantic-ui-react';

interface ITypeChangeInputState {
    type: string;
}
export default class TypeChangeInput extends React.Component<InputProps, ITypeChangeInputState> {
    inputRef: any = React.createRef()
    constructor(props: InputProps) {
        super(props);

        this.state = {
            type: "text"
        }
    }

    public render() {
        return (
            <Input {...this.props}
                ref={this.inputRef}
                type={this.state.type}
                iconPosition="left"
                action={<Button
                    content={this.state.type === "text" ? "123" : "abc"}
                    onClick={() => {
                        this.setState({ type: this.state.type === "text" ? "number" : "text" })
                        this.inputRef.current.focus()
                    }}
                />}
            />
        );
    }
}
