import * as React from 'react';
import { Menu, Icon, Popup, List} from 'semantic-ui-react';
import Auth from '../services/Auth';
import { Link, withRouter } from 'react-router-dom';
import { NavbarWorkProps } from './interfaces/interfaces';
import { FileModule } from '../persistence/fileDAO';
import { Model } from '../entities/model';
import { DataAccessProvider } from '../persistence/dataAccessProvider';
import { LoadFileTask, GetOpenedFilesTask } from '../services/ModelTasks';
import { ModelComponent } from '../entities/modelTaskMetadata';

export class Navbar extends React.Component<NavbarWorkProps, {}> {

    allowedExtensions = ".n3,.ttl,.rdf";
    loadedFiles = [];

    constructor(props: NavbarWorkProps) {
        super(props);
        this.iconClick = this.iconClick.bind(this);
        this.setLoadedFiles = this.setLoadedFiles.bind(this);
        this.OpenedFiles = this.OpenedFiles.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
    }

    public setLoadedFiles(files: any) {
        this.loadedFiles = files;
    }

    logoutButton(event: any) {
        Auth.logout();
        // this.props.history.push("/login");
    }

    uploadFileButton() {
        let input = document.getElementById("importGraph");
        if (input) {
            input.click();
        } else {
            console.log("Could not find element 'importGraph'");
        }
    }

    iconClick() {
        this.props.callback(!this.props.visible);
    }

    importGraph(e: any) {
        let input = (document.getElementById("importGraph") as HTMLInputElement);

        if (input) {
            let files = input.files;
            let fileDAO = DataAccessProvider.getInstance().getFileDAO();
            if (files) {
                if (files[0]) {
                    fileDAO.find(new FileModule(ModelComponent.DataGraph, files[0].name, files[0]));
                }
            } else {
                console.log("error: no files found");
            }
        } else {
            console.log("error: could not find importGraph button");
        }
    }

    // TODO not only load datagraph
    saveGraph(e: any) {
        let model: Model = DataAccessProvider.getInstance().model;
        model.tasks.schedule(new GetOpenedFilesTask(ModelComponent.DataGraph, this));
        model.tasks.processTask();
    }

    getFileFromPopup(e: any) {
        let fileName = (e.target || e.srcElement).innerHTML;
        console.log(fileName);
        let model: Model = DataAccessProvider.getInstance().model;
        model.tasks.schedule(new LoadFileTask(ModelComponent.DataGraph, fileName));
        model.tasks.processTask();
    }

    /*
    * Used for dynamically building the list of opened files in the editor
    */
    OpenedFiles(props: any) {
        let items: any[] = [];

        for (let i = 0; i < this.loadedFiles.length; i++) {
            let cur = this.loadedFiles[i];
            items.push(
                <li key={cur}>
                    <button onClick={this.getFileFromPopup}>
                        {cur}
                    </button>
                </li>
            );
        }

        if (items.length === 0) {
            return <label>No files currently opened in the editor </label> ;
        }

        return (
            <div>
                <label>Files that are currently opened in the editor: </label>
                <br />
                <List items={items} />
            </div>
        );
    }

    uploadProjectButton() {
        let input = document.getElementById("importProject");
        if (input) {
            input.click();
        } else {
            console.log("error: could not find importProject button");
        }
    }

    importProject(e: any) {
        console.log(e);
    }

    render() {

        return (
            <div>
                <Menu
                    inverted={true}
                    size="large"
                    icon={true}
                    style={{
                        borderRadius: 0,
                    }}
                >
                    {/* Toolbar icons */}
                    <Menu.Item as="a" onClick={this.iconClick} content={<Icon name='content'/>}/>
                    <Popup
                        trigger={<Menu.Item as="a" id="delete" content={<Icon name='trash'/>}/>}
                        content='Delete selected component(s) from graph'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={<Menu.Item as="a" id="undo" content={<Icon name='reply'/>}/>}
                        content='Undo last action'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={<Menu.Item as="a" id="redo" content={<Icon name='share'/>}/>}
                        content='Redo last action'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={<Menu.Item as="a" id="camera" content={<Icon name='camera'/>}/>}
                        content='Generate snap shot of current graph'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={
                            <Menu.Item
                                as="a"
                                id="zoom in"
                                content={<Icon name='search' style={{paddingRight: '1em'}}/>}
                            />}
                        content='Zoom in'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={
                            <Menu.Item
                                as="a"
                                id="zoom out"
                                content={<Icon name='search' style={{paddingRight: '1em'}}/>}
                            />}
                        content='Zoom out'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={<Menu.Item as="a" id="actual size" content={<Icon name='compress'/>}/>}
                        content='Set current graph to actual size'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Popup
                        trigger={<Menu.Item as="a" id="fit" content={<Icon name='expand'/>}/>}
                        content='Make graph fit the screen'
                        size="mini"
                        position='bottom left'
                        inverted={true}
                    />

                    <Menu.Item as="a" onClick={this.uploadProjectButton}>
                        Import Project
                        <input
                            onChange={this.importProject}
                            type="file"
                            id="importProject"
                            style={{"display" : "none"}}

                        />
                    </Menu.Item>
                    <Menu.Item as="a">Save Project</Menu.Item>
                    <Menu.Item as="a" onClick={this.uploadFileButton}>
                        Import Graph
                        <input
                            onChange={this.importGraph}
                            type="file"
                            id="importGraph"
                            style={{"display" : "none"}}
                            accept={this.allowedExtensions}
                        />
                    </Menu.Item>

                        <Popup
                            trigger={<Menu.Item as="a" onClick={this.saveGraph}>Save Graph</Menu.Item>}
                            on="click"
                            inverted={false}
                        >
                            <this.OpenedFiles />
                        </Popup>

                    <Menu.Item
                        as="a"
                        href="https://github.com/dubious-developments/UnSHACLed"
                        target="_blank"
                        icon={
                            <Icon
                                name="github"
                                inverted={true}
                            />
                        }
                    />
                    <Menu.Item
                        as="a"
                        target="_blank"
                        href="https://github.com/dubious-developments/UnSHACLed/wiki/Release-notes"
                    >
                        v0.3
                    </Menu.Item>
                    <Menu.Item
                        as={Link}
                        to="/login"
                        onClick={(event) => this.logoutButton(event)}
                    >
                        Logout
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

export default Navbar; // withRouter(Navbar);