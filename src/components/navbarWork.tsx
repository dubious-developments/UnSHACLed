import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Auth from "../services/Auth";
import { withRouter } from 'react-router-dom';
import {FileModule, FileDAO} from "../persistence/fileDAO";
import {Model, ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {ProcessorTask} from "../entities/taskProcessor";
import {Component} from "../persistence/component";

class LoadFileTask extends ProcessorTask<ModelData, ModelTaskMetadata> {

    /**
     * Create a new load file task from Model
     * Contains a function that will execute on the model.
     * @param {mComponent} ModelComponent
     */
    public constructor(mComponent: ModelComponent) {
        super(function(data: ModelData) {
            let component: Component = data.getComponent(mComponent);
            if (component) {
                // TODO open popup to pick file
                console.log("component: ", component.getPart("log_sample.ttl"));
                // TODO how to get the current file?
                // var module = new FileModule(ModelComponent.DataGraph, filename, file);
                // TODO how to get the current type
                var fileDAO: FileDAO = DataAccessProvider.getInstance().getFileDAO();
                var blob = new Blob([], {type: "text/turtle"});
                fileDAO.insert(new FileModule(ModelComponent.DataGraph, "log_sample.ttl", blob));
            }
        },    null);
    }
}

class GetOpenedFilesTask extends ProcessorTask<ModelData, ModelTaskMetadata> {

    /**
     * Get the loaded files in the model
     * Contains a function that will execute on the model.
     * @param {FileModule} module
     */
    public constructor(c: ModelComponent) {
        super(function(data: ModelData) {
            let component: Component = data.getComponent(c);
            if (component) {
                var promise = new Promise((resolve, reject) => {
                    resolve(component.getAllKeys());
                });
                promise.then(
                    (value) => {
                        // TODO give callback to execute GUI code here
                        console.log("fulfilled: ", value);
                    }
                );
            }
        },    null);
    }
}

class Navbar extends React.Component<any, any> {

    allowedExtensions = ".n3,.ttl,.rdf";

    constructor(props: string) {
        super(props);
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
        // TODO map extension on MIME type for common extensions
        var fileDAO = DataAccessProvider.getInstance().getFileDAO();
        fileDAO.find(new FileModule(ModelComponent.DataGraph, file.name, file));
    }

    // TODO not only load datagraph
    saveGraph(e: any) {
        var model: Model = DataAccessProvider.getInstance().tmpModel;
        model.tasks.schedule(new GetOpenedFilesTask(ModelComponent.DataGraph));
        model.tasks.processTask();
        model.tasks.schedule(new LoadFileTask(ModelComponent.DataGraph));
        model.tasks.processTask();
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
                        <Menu.Item as="a" onClick={this.saveGraph}>
                            Save Graph
                        </Menu.Item>
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