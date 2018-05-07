import * as React from 'react';
import {Modal, Button} from 'semantic-ui-react';
import {RepoModalProps} from '../components/interfaces/interfaces';

/*
    Component used to create a dropdown component for the file toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class RepoModal extends React.Component<RepoModalProps, any> {

    constructor(props: any) {
        super(props);
        this.modalContent = this.modalContent.bind(this);
    }

    modalContent() {
        return (
            <Button> Test </Button>
        );
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
                >
                    <Modal.Header>GitHub repo's</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p> Projects </p>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default RepoModal;