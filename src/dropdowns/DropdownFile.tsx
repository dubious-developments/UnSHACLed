import * as React from 'react';
import {Dropdown, Button} from 'semantic-ui-react';
import {DropdownFileProps} from '../components/interfaces/interfaces';
import RepoModal from '../modals/RepoModal';
import NewModal from '../modals/NewModal';

/*
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
        this.cancelCallback = this.cancelCallback.bind(this);
        this.confirmCallback = this.confirmCallback.bind(this);
        this.showRepoModal = this.showRepoModal.bind(this);
        this.showNewModal = this.showNewModal.bind(this);
        this.submitCallBack = this.submitCallBack.bind(this);
    }

    getOpenedFiles() {
        let items: any[] = [];

        if (this.props.opened_files.length === 0) {
            console.log('no files found in child component');
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

    showRepoModal() {
        this.setState({
            repoVisible: true
        });
    }

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
        if (type === 'file') {
            console.log('Create a new file with name' + name + ' in ' + project);
        } else if (type === 'project') {
            console.log('Create new project with name ' + name);
        }
        this.setState({
            newVisible: false
        });
    }

    /**
     *  Function that will handle callback from child component
     to adapt right state
     */

    confirmCallback(type: any) {
        this.setState({
            repoVisible: false
        });
    }

    /**Function that will handle callback from child component
     to adapt right state
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
                        <Dropdown.Item icon='github' text='Save graph to account'/>
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

export default DropdownFile;