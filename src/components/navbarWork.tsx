import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Auth from "../services/Auth";
import { withRouter } from 'react-router-dom';
import {FileModule, FileDAO} from "../persistence/fileDAO";
import {Model, ModelComponent} from "../entities/model";
import FileSaver from 'file-saver';
import {DataAccessProvider} from "../persistence/dataAccessProvider";

class Navbar extends React.Component<any, any> {

    allowedExtensions = ".n3,.ttl,.rdf";

    // TODO
    module: Module;

    constructor(props: string) {
        super(props);

        this.importGraph = this.importGraph.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
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
        this.module = new FileModule(ModelComponent.DataGraph, file.name, file);
        console.log(this.module);
        // TODO improve this (implemnt DAO getter)
        var fileDAO = DataAccessProvider.getInstance().getFileDAO();
        fileDAO.find(this.module);
    }

    saveGraph(e: any) {
        var filename = "unshacled";
        // TODO how to get the current file?
        // var module = new FileModule(ModelComponent.DataGraph, filename, file);
        // TODO how to get the current type
        var blob = new Blob([this.module.getTarget()], {type: "TODO"});
        var model: Model = DataAccessProvider.getInstance().tmpModel;
        console.log(model);
        FileSaver.saveAs(blob, filename);
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