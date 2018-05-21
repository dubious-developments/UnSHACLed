import * as React from "react";
import {Header, Modal} from "semantic-ui-react";

class LockModal extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Modal
                closeIcon={false}
                mountNode={document.getElementById("root")}
                style={{
                    marginTop: '0 !important',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    position: 'relative',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}

                open={this.props.open}
            >
                <Header icon='lock' content='Lock warning'/>
                <Modal.Content>
                    <p>
                        You have no lock on this file.
                    </p>
                </Modal.Content>
            </Modal>
        );
    }
}

export default LockModal;