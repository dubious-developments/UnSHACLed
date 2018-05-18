import * as React from 'react';
import {Dropdown, Button} from 'semantic-ui-react';
import {DropdownFileProps} from '../components/interfaces/interfaces';
import RepoModal from '../modals/RepoModal';
import NewModal from '../modals/NewModal';
import {connect} from 'react-redux';

/**
 Component used to create a dropdown component for the file toolbar option
 Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownFile extends React.Component<DropdownFileProps & any, any> {

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
        let content = this.props.github_files.content;

        if (content.length === 0) {
            items.push(<Button key="none" icon="ban" disabled={true} basic={true} content="No files opened"/>);
        }

        for (let i = 0; i < content.length; i++) {
            let cur = content[i];
            items.push(
                <Button
                    key={cur.name + i}
                    icon="save"
                    basic={true}
                    content={cur.name}
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
                            icon='github'
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
                        <Dropdown.Item icon='trash' text='Clear graph' id='tb_clear_graph'/>
                    </Dropdown.Menu>
                </Dropdown>
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
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 * @returns {{token}}: sets props.token
 */
const mapStateToProps = (state, props) => {
    return {
        github_files: state.files
    };
};

export default connect(mapStateToProps)(DropdownFile);