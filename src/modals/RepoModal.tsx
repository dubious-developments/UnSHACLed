import * as React from 'react';
import {Modal, Button, Icon, Dropdown} from 'semantic-ui-react';
import {RepoModalProps} from '../components/interfaces/interfaces';

/*
    Component used to create a dropdown component for the file toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class RepoModal extends React.Component<RepoModalProps, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: true
        };
        this.setSelected = this.setSelected.bind(this);
    }

    setSelected() {
        this.setState({
            selected: false
        });
    }

    render() {
        let projects = [{text: " Project 1", value: "Project 1"}, {text: " Project 2", value: "Project 2"}];
        let {selected} = this.state;
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
                        <Dropdown
                            placeholder='Select Project'
                            fluid={true}
                            selection={true}
                            options={projects}
                            onChange={this.setSelected}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={() => this.props.cancel_cb("RepoModal")}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='green' onClick={() => this.props.confirm_cb("RepoModal")} disabled={selected}>
                            <Icon name='checkmark'/> Open
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default RepoModal;