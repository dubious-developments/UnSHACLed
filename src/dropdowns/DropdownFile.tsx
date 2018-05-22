import * as React from 'react';
import {Dropdown, Button, Icon} from 'semantic-ui-react';
import {DropdownFileProps} from '../components/interfaces/interfaces';
import RepoModal from '../modals/RepoModal';
import NewModal from '../modals/NewModal';
import {connect} from 'react-redux';
import {ModelComponent} from "../entities/modelTaskMetadata";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {RemoteFileModule} from "../persistence/remoteFileDAO";
import RequestModule from "../requests/RequestModule";
import {LocalFileModule} from "../persistence/localFileDAO";

/**
 Component used to create a dropdown component for the file toolbar option
 Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownFile extends React.Component<DropdownFileProps & any, any> {

    /**
     * Constructor of component
     * @param props
     */
    constructor(props: any) {
        super(props);
        this.state = {
            repoVisible: false,
            newvisible: false,
            newType: ''
        };
        this.getOpenedFiles = this.getOpenedFiles.bind(this);
        this.getGitHubFiles = this.getGitHubFiles.bind(this);
        this.cancelCallback = this.cancelCallback.bind(this);
        this.confirmCallback = this.confirmCallback.bind(this);
        this.showRepoModal = this.showRepoModal.bind(this);
        this.showNewModal = this.showNewModal.bind(this);
        this.submitCallBack = this.submitCallBack.bind(this);
        this.loadWorkspace = this.loadWorkspace.bind(this);
        this.saveWorkspace = this.saveWorkspace.bind(this);
        this.saveFileToAccount = this.saveFileToAccount.bind(this);
        this.getRepoAndType = this.getRepoAndType.bind(this);
        this.saveLocalWorkspace = this.saveLocalWorkspace.bind(this);
        this.loadLocalWorkspace = this.loadLocalWorkspace.bind(this);
    }

    /**
     * Component that contains the currently opened files (local files ) in the editor.
     * @param: none
     * @return Button Group of all opened files, or a single button if no files are opened.
     */
    getOpenedFiles() {
        let items: any[] = [];

        if (this.props.opened_files.length === 0) {
            items.push(<Button key="none" icon="ban" disabled={true} basic={true} content="No files opened"/>);
        }

        for (let i = 0; i < this.props.opened_files.length; i++) {
            let cur = this.props.opened_files[i];
            items.push(
                <Button
                    key={cur + i}
                    icon="save"
                    basic={true}
                    content={cur}
                    onClick={() => this.props.get_file_from_popup(cur)}
                />
            );
        }

        return (
            <div style={{padding: 0, margin: 0}}>
                <Button.Group vertical={true}>
                    {items}
                </Button.Group>
            </div>
        );
    }

    /**
     * Component that contains the currently opened files (github files ) in the editor.
     * @param: none
     * @return Button Group of all opened files, or a single button if no files are opened.
     */

    getGitHubFiles() {
        console.log(this.props);
        let items: any[] = [];
        let content = this.props.save_files.content;

        if (content.length === 0) {
            items.push(<Button key="none" icon="ban" disabled={true} basic={true} content="No locks acquired"/>);
        }

        for (let i = 0; i < content.length; i++) {
            let cur = content[i];
            items.push(
                <Button
                    key={cur.name + i}
                    icon="save"
                    basic={true}
                    content={cur.name}
                    onClick={() => this.saveFileToAccount(cur.name)}
                />
            );
        }

        return (
            <div style={{padding: 0, margin: 0}}>
                <Button.Group vertical={true}>
                    {items}
                </Button.Group>
            </div>
        );
    }

    /**
     * Method that will adapt the current state of the 'repoVisible' attribute
     * which is used to determine if the repository modal should be made visible or not.
     * @param: none
     * @return: none
     */
    showRepoModal() {
        this.setState({
            repoVisible: true
        });
    }

    /**
     * Method that will adapt the current state of the 'newVisible' and 'newType' attributes
     * which are used to determine if the new creation modal should be made visible or not and
     * what type of modal should be generated
     * @param: type: type of modal to be shown.
     * @return: none
     */
    showNewModal(type: any) {
        this.setState({
            newVisible: true,
            newType: type
        });
    }

    /**
     *  Function that will handle callback from child component
     to adapt right state
     @param: type of submit callback. Can either be 'file' or 'project'
     @param: name name of file/project to be created.
     @param: project: name of project where the file should be added. Omitted if only a file is created.
     */
    submitCallBack(type: any, name: any, project: any) {
        this.setState({
            newVisible: false
        });
    }

    /**
     *  Function that will handle callback from child component
     to adapt right state
     @param: type of modal firing the callback.
     @param: dataType: type of graph (either be SHACL or data)
     @return: none
     */

    confirmCallback(type: any, dataType: any) {
        this.setState({
            repoVisible: false
        });
    }

    /**Function that will handle callback from child component
     to adapt right state
     @param: type of modal firing the callback.
     */
    cancelCallback(type: any) {
        this.setState({
            repoVisible: false,
            newVisible: false
        });
    }

    /**
     * Method to load a workspace. The user need to provide a valid
     * workspace formatted file obtained by saving the workspace before hand.
     */
    loadWorkspace() {
        console.log("loggin workspace");
        // get remote file DAO
        let remotefileDAO = DataAccessProvider.getInstance().getRemoteFileDAO();
        // load remote workspace
        remotefileDAO.findWorkspace(new RemoteFileModule
        (ModelComponent.Workspace, this.props.user, this.state.fileName, this.state.projectName, this.props.token));
    }

    /**
     * Method to save the current workspace. The workspace will be downloaded
     * through the users browser in a valid workspace formatted file.
     */

    /**
     * Method that will invoke the html input to load a workspace.
     */
    clickWorkspace(type: any) {
        let input;
        if (type === 'load') {
            input = document.getElementById("loadWorkspace");
        }
        if (input) {
            input.click();
        } else {
            console.error("Could not find workspace component!");
        }
    }

    saveWorkspace() {
        console.log("saving workspace");
        // get remote file DAO
        let remotefileDAO = DataAccessProvider.getInstance().getRemoteFileDAO();
        // save remote workspace
        remotefileDAO.insertWorkspace(new RemoteFileModule
        (ModelComponent.Workspace, this.props.user, this.state.fileName, this.state.projectName, this.props.token));
    }

    loadLocalWorkspace() {
        let input = (document.getElementById("loadWorkspace") as HTMLInputElement);
        if (input) {
            let files = input.files;
            let fileDAO = DataAccessProvider.getInstance().getLocalFileDAO();
            if (files) {
                if (files[0]) {
                    fileDAO.findWorkspace(new LocalFileModule(ModelComponent.Workspace, files[0].name, files[0]));
                    console.log(files[0]);
                }
            } else {
                console.error("error: no files found");
            }
        } else {
            console.error("error: could not find loadWorkspace button");
        }
    }

    saveLocalWorkspace() {
        console.log("saving local workspace");
        let fileDAO = DataAccessProvider.getInstance().getLocalFileDAO();
        fileDAO.insertWorkspace(new LocalFileModule(ModelComponent.Workspace, "local_workspace.json", new Blob([])));
    }

    /**
     * Method used to search for the repository name and file type associated with a filename.
     * The method will traverse through the list of openend files in the global state
     * and return the associated repository and type.
     * @param fileName: name of file for which the repository is requested.
     * @return [repo, type ]
     */
    getRepoAndType(fileName: any) {
        // get list of opened files
        let files = this.props.files.content;

        for (let file of files) {
            if (file.name === fileName) {
                return [file.repo, file.type];
            }
        }
        return '';
    }

    /**
     * Method that will invoke the backend to save the selected file to the remote account.
     * @param fileName
     */
    saveFileToAccount(fileName: any) {
        // get type and repo name for file
        let o = this.getRepoAndType(fileName);
        let repo = o[0];
        let type = o[1];
        // invoke backend method
        let target;
        // determine which type of model to target
        if (type === 'data') {
            target = ModelComponent.DataGraph;
        } else if (type === 'SHACL') {
            target = ModelComponent.SHACLShapesGraph;
        } else {
            console.log("invalid type");
        }
        // check if lock on file
        let repoOwner = RequestModule.getRepoOwnerFromFile(fileName, this.props.files.content);
        // release lock
        // get remote file DAO
        let remotefileDAO = DataAccessProvider.getInstance().getRemoteFileDAO();
        RequestModule.hasLock(repoOwner, repo, this.props.token, fileName).then(bool => {
            if (!bool) {
                console.log('dont have a lock so request');
                RequestModule.requestLock(repoOwner, repo, this.props.token, fileName).then(lock => {
                    if (lock === true) {

                        // update remote file
                        remotefileDAO.insert(new RemoteFileModule
                        (target, repoOwner, fileName, repo, this.props.token));
                    }
                });
            } else {
                // update remote file
                remotefileDAO.insert(new RemoteFileModule
                (target, repoOwner, fileName, repo, this.props.token));
            }
        });

    }

    /** Render component **/
    render() {
        let {repoVisible, newVisible, newType} = this.state;
        return (
            <div>
                <Dropdown text='File' pointing="top left">
                    <Dropdown.Menu>
                        <Dropdown.Item text='New Project' onClick={() => this.showNewModal('project')}/>
                        <Dropdown.Item text='New File' onClick={() => this.showNewModal('file')}/>
                        <Dropdown
                            text='Open local graph'
                            pointing='left'
                            className='link item'
                        >
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => this.props.import_cb("shacl")}> SHACL
                                    Graph </Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.import_cb("data")}> Data Graph</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown
                            text='Save local graph'
                            pointing='left'
                            className='link item'
                            onClick={() => this.props.save_graph()}
                        >
                            <Dropdown.Menu content={<this.getOpenedFiles/>}/>
                        </Dropdown>
                        <Dropdown.Divider/>
                        <Dropdown.Item
                            onClick={this.showRepoModal}
                            text='Open graph from account'
                        />
                        <Dropdown
                            text='Save graph to account'
                            pointing='left'
                            className='link item'
                        >
                            <Dropdown.Menu content={<this.getGitHubFiles/>}/>
                        </Dropdown>
                        <Dropdown.Divider/>
                        <Dropdown.Item text='Load workspace' onClick={this.loadWorkspace}/>
                        <Dropdown.Item text='Save workspace' onClick={this.saveWorkspace}/>
                        <Dropdown.Item text='Load local workspace' onClick={() => this.clickWorkspace('load')}/>
                        <Dropdown.Item text='Save local workspace' onClick={this.saveLocalWorkspace}/>

                    </Dropdown.Menu>
                </Dropdown>

                <input
                    onChange={this.loadLocalWorkspace}
                    type="file"
                    id="loadWorkspace"
                    style={{"display": "none"}}
                />

                {repoVisible ?
                    <RepoModal
                        visible={repoVisible}
                        confirm_cb={this.confirmCallback}
                        cancel_cb={this.cancelCallback}
                    /> : null}
                {newVisible ?
                    <NewModal
                        visible={newVisible}
                        type={newType}
                        cancel_cb={this.cancelCallback}
                        confirm_cb={this.submitCallBack}
                    />
                    : null
                }
            </div>
        );
    }
}

/**
 * Map global store to props of this component. Here the locks
 * in the global state are used. A user can only save files on which
 * he/she acquired a lock.
 * @param state: state retrieved from the global redux store.
 * @returns {{token}}: sets props.token
 */
const mapStateToProps = (state, props) => {
    return {
        save_files: state.locks,
        files: state.files,
        login: state.login,
        token: state.token
    };
};

export default connect(mapStateToProps)(DropdownFile);