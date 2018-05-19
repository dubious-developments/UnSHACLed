import * as React from 'react';
import {Modal, Button, Icon, Dropdown, Checkbox, Form} from 'semantic-ui-react';
import {RepoModalProps} from '../components/interfaces/interfaces';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';
import {appendFile} from "../redux/actions/fileActions";
import {DataAccessProvider} from '../persistence/dataAccessProvider';
import {RemoteFileModule} from '../persistence/remoteFileDAO';
import {ModelComponent} from '../entities/modelTaskMetadata';

/**
 Component used to create a modal for opening files from projects
 Requires several props from the parent, which can be found in interfaces.d.ts

 */
class RepoModal extends React.Component<RepoModalProps & any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: true,
            files: true,
            repos: [],
            fileList: [],
            type: '',
            projectName: '',
            fileName: ''
        };
        this.setSelected = this.setSelected.bind(this);
        this.setFilesSelected = this.setFilesSelected.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.confirmModal = this.confirmModal.bind(this);
        this.processRepos = this.processRepos.bind(this);
        this.processFile = this.processFile.bind(this);
        this.handleType = this.handleType.bind(this);
        this.appendFile = this.appendFile.bind(this);
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
     * Method that will map an array of files required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param repoArray
     */
    processFile(files: any) {
        /* set state */
        this.setState({
            fileList: RequestModule.processFiles(files)
        });
    }

    /**
     * Method that will adapt the current state of the 'selected' attribute
     * which is used to determine if a second dropdown should be visible or not.
     * @param: none
     * @return: none
     */
    setSelected(e: any, {value}: any) {
        RequestModule.getFilesFromRepo(this.props.user, value, this.props.token).then(files => {
            this.processFile(files);
        });
        this.setState({
            selected: false,
            projectName: value
        });
    }

    /**
     * Method that will adapt the current state of the 'files' attribute
     * which is used to determine wether the confirm button should be
     * enable or disabled.
     * @param: none
     * @return: none
     */
    setFilesSelected(e: any, {value}: any) {
        this.setState({
            files: false,
            fileName: value
        });
    }

    /**
     * Method that will adapt the current state of the 'type' attribute
     * which is used to determine which type of file the users wants to open
     * @param: e : event
     * @param: value: selected value in checkbox
     * @return: none
     */
    handleType(e: any, {value}: any) {
        this.setState({
            type: value
        });
    }

    /**
     * Function fired when a user click the cancel button on the modal.
     * Will adapt the current state to its initial settings and will call the callback
     * function received from the parent which will handle the cancel functionality.
     * @param: none
     * @return: none
     */
    cancelModal() {
        this.props.cancel_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    /**
     * Function fired when a user click the confirm button on the modal.
     * Will adapt the current state to its initial settings and will call the callback
     * function received from the parent which will handle the confirm functionality.
     * @param: none
     * @return: none
     */
    confirmModal() {
        this.props.confirm_cb("RepoModal", this.state.type);
        // Invoke backend method
        let target;
        // determine which type of model to target
        if (this.state.type === 'data') {
            target = ModelComponent.DataGraph;
        } else if (this.state.type === 'SHACL') {
            target = ModelComponent.SHACLShapesGraph;
        } else {
            console.log("invalid type");
        }
        let remotefileDAO = DataAccessProvider.getInstance().getRemoteFileDAO();
        remotefileDAO.find(new RemoteFileModule
        (target, this.props.user, this.state.fileName, this.state.projectName, this.props.token));

        // Log opened file into global state (redux store)
        this.appendFile(this.state.fileName, this.state.projectName, this.state.type);
        // set state
        this.setState({
            files: true,
            selected: true
        });
    }

    /**
     * Method use to call the prop function which is bound to the action from the global
     * store. This will update the global store with the newly opened file.
     * @param fileName: name of file being opened and which should be added to the global sotre
     * @param repoName: name of the repository the file resides in
     * @param type: type of file. can either be 'SHACL' or 'data'.
     * @return {any}
     */
    appendFile(fileName: any, repoName: any, type: any) {
        // Dispatch action to the redux store
        this.props.appendFile(fileName, repoName, type);
        console.log(this.props);
    }

    render() {
        let {selected, files, repos, fileList} = this.state;
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
                    <Modal.Header> Open graph from account </Modal.Header>
                    <Modal.Content>
                        <Dropdown
                            placeholder='Select Project'
                            fluid={true}
                            selection={true}
                            options={repos}
                            onChange={this.setSelected}
                        />
                        {selected === false && (
                            <div style={{marginTop: '1em'}}>
                                <Dropdown
                                    placeholder='Select Graph File'
                                    fluid={true}
                                    selection={true}
                                    options={fileList}
                                    onChange={this.setFilesSelected}
                                />
                                <Form style={{marginTop: '1em'}}>
                                    <Form.Field>
                                        Selected type: <b>{this.state.type}</b>
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox
                                            label='Data'
                                            value='data'
                                            checked={this.state.type === 'data'}
                                            onChange={this.handleType}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox
                                            label='SHACL'
                                            value='SHACL'
                                            checked={this.state.type === 'SHACL'}
                                            onChange={this.handleType}
                                        />
                                    </Form.Field>
                                </Form>
                            </div>)
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.cancelModal}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='green' onClick={this.confirmModal} disabled={files}>
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
        token: state.token,
        user: state.login,
        files: state.files
    };
};

/**
 * Map redux actions to props of this component. A method call to the props function
 * will automatically dispatch the action through redux without an explicit
 * dispatch call to the global store
 */
const mapActionsToProps = {
    appendFile: appendFile

};
export default connect(mapStateToProps, mapActionsToProps)(RepoModal);