import * as React from 'react';
import {Modal, Button, Icon, Input} from 'semantic-ui-react';
import {NewModalProps} from '../components/interfaces/interfaces';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';

/*
    Component used to create a model for new file/project creation.
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class NewModal extends React.Component<NewModalProps & any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: true,
            repos: [],
            name: ''
        };
        this.cancelModal = this.cancelModal.bind(this);
        this.confirmModal = this.confirmModal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        RequestModule.getUserRepos(this.props.token).then(repoArray => {
            console.log(repoArray);
            this.processRepos(repoArray);
        });
    }

    /**
     * Method that will map an array of repos required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param repoArray
     */
    processRepos(repoArray: any) {
        let result: any[] = [];
        for (let i in repoArray) {
            result.push(
                {
                    text: repoArray[i].split("/")[1],
                    value: repoArray[i].split("/")[1]
                }
            );
        }
        console.log(result);
        /* set state */
        this.setState({
            repos: result
        });
    }

    cancelModal() {
        this.props.cancel_cb("UserModal");
        this.setState({
            selected: true
        });
    }

    confirmModal() {
        this.props.confirm_cb(this.props.type, this.state.name, 'project1');
        this.setState({
            selected: true
        });
    }

    onChange(event: any) {
        console.log(event.target.value);
        this.setState({
            name: event.target.value,
            selected: false
        });
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
                    onClose={this.cancelModal}
                >
                    <Modal.Header>Create a new {this.props.type} </Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            {this.props.type === 'file' ?
                                <div>
                                    <p>
                                        Create a new file by selecting a project where you want to
                                        add the file and fill in a name of your choice. After creation,
                                        open the newly created file through the editor. {this.state.name}
                                    </p>

                                </div>
                                :
                                <p>
                                    Create a new project by choosing a name of your choice. After creation,
                                    add new files to your project through the editor
                                </p>
                            }
                        </Modal.Description>
                        <Input
                            icon='add'
                            placeholder='Choose a name...'
                            size='large'
                            style={{marginTop: '1em'}}
                            onChange={this.onChange}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.cancelModal}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='green' onClick={this.confirmModal} disabled={this.state.selected}>
                            <Icon name='checkmark'/> Open
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

/**
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 * @returns {{token}}: sets props.token
 */
const mapStateToProps = (state, props) => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps)(NewModal);