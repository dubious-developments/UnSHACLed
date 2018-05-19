import * as React from 'react';
import {Modal, Button, Icon, Input, Dropdown} from 'semantic-ui-react';
import {NewModalProps} from '../components/interfaces/interfaces';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';

/**
 Component used to create a model for new file/project creation.
 Requires several props from the parent, which can be found in interfaces.d.ts

 */
class NewModal extends React.Component<NewModalProps & any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: true,
            repos: [],
            name: '',
            project: ''
        };
        this.cancelModal = this.cancelModal.bind(this);
        this.confirmModal = this.confirmModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setSelected = this.setSelected.bind(this);
    }

    /**
     * Method immediately invoked when this component is mounted.
     * Will request the repositories from the currently authenticated user through the Request module
     * and set the component state according to its results.
     */
    componentDidMount() {
        RequestModule.getUserRepos(this.props.token).then(repoArray => {
            this.processRepos(repoArray);
        });
    }

    /**
     * Method that will map an array of repos required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param repoArray
     */
    processRepos(repoArray: any) {
        /* set state */
        this.setState({
            repos: RequestModule.processRepos(repoArray)
        });
    }

    /**
     * Function fired when a project is chosen from the dropdown menu.
     * Will adapt the current state 'project' to the selected project name
     * @param event: on change event
     */
    setSelected(e: any, {value}: any) {
        this.setState({
            project: value
        });
    }

    /**
     * Function fired when a user click the cancel button or close button on the modal.
     * Will adapt the current state to its initial settings and will call the callback
     * function received from the parent which will handle the cancel functionality.
     * @param: none
     */
    cancelModal() {
        this.props.cancel_cb("UserModal");
        this.setState({
            selected: true
        });
    }

    /**
     * Function fired when a user click the confirm button on the modal.
     * Will adapt the current state to its initial settings and will call the callback
     * function received from the parent which will handle the confirm functionality.
     * It will also perform an API request to the collaboration server
     * @param: type: type of creation, either 'file' or  'project'
     */
    confirmModal(type: any) {
        if (type === 'file') {
            RequestModule.updateFile(
                this.props.user, this.state.project, this.props.token, this.state.name, 'Hello World');
        } else if (type === 'project') {
            RequestModule.createRepo(this.state.name, this.props.token);
        }
        /* callback to parent */
        this.props.confirm_cb('UserModal');
        /* set state */
        this.setState({
            selected: true
        });
    }

    /**
     * Function fired when the user types in a new name for a file/project.
     * Will adapt the current state 'name' to the current input value and set the
     * state 'selected' to false, so the user is able to confirm.
     * @param event: on change event
     */
    onChange(event: any) {
        /* set state */
        this.setState({
            name: event.target.value,
            selected: false
        });
    }

    render() {
        let {repos} = this.state;
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
                                        open the newly created file through the editor.
                                    </p>
                                    <Dropdown
                                        placeholder='Select Project'
                                        fluid={true}
                                        selection={true}
                                        options={repos}
                                        onChange={this.setSelected}
                                    />
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
                        <Button
                            color='green'
                            onClick={() => this.confirmModal(this.props.type)}
                            disabled={this.state.selected}
                        >
                            <Icon name='checkmark'/> Create
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
        token: state.token,
        user: state.login
    };
};

export default connect(mapStateToProps)(NewModal);