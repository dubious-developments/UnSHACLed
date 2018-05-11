import * as React from 'react';
import {Modal} from 'semantic-ui-react';
import {UserModalProps} from '../components/interfaces/interfaces';

/*
    Component used to create a dropdown component for the file toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class UserModal extends React.Component<UserModalProps, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <Modal
                    open={this.props.visible}
                    style={{
                        marginTop: '0 !important',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                    closeIcon={true}
                    onClose={this.props.onClose_cb}
                >
                    <Modal.Header> User info </Modal.Header>

                </Modal>
            </div>
        );
    }
}

export default UserModal;