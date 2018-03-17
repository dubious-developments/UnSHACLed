import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Auth from "../services/Auth";
import { withRouter } from 'react-router-dom';
import {FileModule, FileDAO} from "../persistence/fileDAO";
import {Model, ModelComponent} from "../entities/model";
import FileSaver from 'file-saver';

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
        this.module = new FileModule(ModelComponent.DataGraph, file.name, file);
        console.log(this.module);
        // TODO improve this (implemnt DAO getter)
        var fileDAO = new FileDAO(new Model());
        fileDAO.find(this.module);
    }

    saveGraph(e: any) {
        var filename = "unshacled";
        // TODO how to get the current file?
        // var module = new FileModule(ModelComponent.DataGraph, filename, file);
        // TODO how to get the current type
        var blob = new Blob([this.module.getTarget()], {type: "TODO"});
        FileSaver.saveAs(blob, filename);
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
                        <Menu.Item as="a">Import Project</Menu.Item>
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