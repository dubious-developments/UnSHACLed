import * as React from 'react';
import {Confirm, Button} from 'semantic-ui-react';
import {RepoModalProps} from '../components/interfaces/interfaces';

/*
    Component used to create a dropdown component for the file toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class RepoModal extends React.Component<RepoModalProps, any> {

    constructor(props: any) {
        super(props);
    }


    render() {
        return (
            <div>
                <Confirm
                    open={this.props.visible}
                />
            </div>
        );
    }
}

export default RepoModal;