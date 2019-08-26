import React from 'react'
import ReactDropzone, { DropEvent } from 'react-dropzone'
import { Segment, Icon, Header, Button } from 'semantic-ui-react';
import Importer, { TImportHeadType } from '../../util/importer/importer';

export type TData = TImportHeadType

export interface IDropzoneProps<T> {
    head: TData[]
    startRow: number
    callback: (val: T[]|null) => any
}

export interface IDropzoneState {
}

export default class Dropzone<T> extends React.Component<IDropzoneProps<T>, IDropzoneState> {
    constructor(props: IDropzoneProps<T>) {
        super(props);

        this.state = {
        }
    }

    onDrop = (acc: File[], rej: File[], ev: DropEvent) => {
        //Todo: Show Error
        if (acc.length === 0) return;
        const i = new Importer<T>(this.props.head, this.props.startRow);
        i.fromFile(acc[0], this.props.callback);
    }
    public render() {
        return (
            <ReactDropzone multiple={false} accept={['.csv', '.xls', '.xlsx']} onDrop={this.onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <Segment placeholder>
                        <div {...getRootProps()} onClick={undefined}>
                            <Header icon textAlign="center">
                                <Icon name='file excel' />
                                <input {...getInputProps()} />
                            </Header>
                            <Button primary onClick={getRootProps().onClick}>__LOCA__ ADD DOCUMENT</Button>
                        </div>
                    </Segment>
                )}
            </ReactDropzone>
        );
    }
}

