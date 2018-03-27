import * as React from 'react';
import { Menu, Icon, Popup, List} from 'semantic-ui-react';
import Auth from "../services/Auth";
import { withRouter } from 'react-router-dom';
import { FileModule } from "../persistence/fileDAO";
import { Model, ModelComponent } from "../entities/model";
import { DataAccessProvider } from "../persistence/dataAccessProvider";
import { LoadFileTask, GetOpenedFilesTask} from "../services/ModelTasks";

export class Navbar extends React.Component<any, any> {

    allowedExtensions = ".n3,.ttl,.rdf";
    loadedFiles = [];

    constructor(props: string) {
        super(props);

        this.setLoadedFiles = this.setLoadedFiles.bind(this);
        this.OpenedFiles = this.OpenedFiles.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
    }

    public setLoadedFiles(files: any) {
        this.loadedFiles = files;
    }

    logoutButton(event: any) {
        Auth.logout();
        this.props.history.push("/login");
    }

    uploadFileButton() {
        var input = document.getElementById("importGraph");
        input.click();
    }

    saveFileButton() {
        var input = document.getElementById("saveGraph");
        input.click();
    }

    importGraph(e: any) {
        var file = (document.getElementById("importGraph") as HTMLInputElement).files[0];

        var fileDAO = DataAccessProvider.getInstance().getFileDAO();
        if (file) {
            fileDAO.find(new FileModule(ModelComponent.DataGraph, file.name, file));
        }
    }

    // TODO not only load datagraph
    saveGraph(e: any) {
        var model: Model = DataAccessProvider.getInstance().tmpModel;
        model.tasks.schedule(new GetOpenedFilesTask(ModelComponent.DataGraph, this));
        model.tasks.processTask();
    }

    getFileFromPopup(e: any) {
        var fileName = (e.target || e.srcElement).innerHTML;
        console.log(fileName);
        var model: Model = DataAccessProvider.getInstance().tmpModel;
        model.tasks.schedule(new LoadFileTask(ModelComponent.DataGraph, fileName));
        model.tasks.processTask();
    }

    /*
    * Used for dynamically building the list of opened files in the editor
    */
    OpenedFiles(props: any) {
        var items = [];

        for (var i = 0; i < this.loadedFiles.length; i++) {
            var cur = this.loadedFiles[i];
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
        var input = document.getElementById("importProject");
        input.click();
    }

    importProject(e: any) {
        var file = (document.getElementById("importGraph") as HTMLInputElement).files[0];
        console.log(file);
    }

    render() {

        return (
            <div>
                <Menu
                    inverted={true}
                    size="large"
                    icon={true}
                    style={{
                        height: '5.6em',
                        borderRadius: 0,
                    }}
                >
                    <Menu.Menu
                        position="right"
                    >
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
                        v0.1
                        </Menu.Item>
                        <Menu.Item onClick={(event) => this.logoutButton(event)}> Logout </Menu.Item>
                    </Menu.Menu>

                </Menu>
            </div>
        );
    }
}
export default withRouter(Navbar);