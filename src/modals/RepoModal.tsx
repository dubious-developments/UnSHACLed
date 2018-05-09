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
            selected: true,
            files: true
        };
        this.setSelected = this.setSelected.bind(this);
        this.setFilesSelected = this.setFilesSelected.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.confirmModal = this.confirmModal.bind(this);
    }

    setSelected() {
        this.setState({
            selected: false
        });
    }

    setFilesSelected() {
        this.setState({
            files: false
        });
    }

    cancelModal() {
        this.props.cancel_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    confirmModal() {
        this.props.confirm_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    render() {
        let projects = [{text: " Project 1", value: "Project 1"}, {text: " Project 2", value: "Project 2"}];
        let graphs = [{text: " File 1", value: "File 1"}, {text: " File 2", value: "File 2"}];
        let {selected} = this.state;
        let {files} = this.state;
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
                        {selected === false && (
                            <Dropdown
                                placeholder='Select Graph File'
                                fluid={true}
                                selection={true}
                                options={graphs}
                                onChange={this.setFilesSelected}
                            />)
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.cancelModal}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='green' onClick={this.confirmModal} disabled={files} >
                            <Icon name='checkmark'/> Open
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default RepoModal;