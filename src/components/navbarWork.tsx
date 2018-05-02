import * as React from 'react';
import {Menu, Icon, Popup, List, Dropdown} from 'semantic-ui-react';
import Auth from '../services/Auth';
import {Link} from 'react-router-dom';
import {NavbarWorkProps} from './interfaces/interfaces';
import {FileModule} from '../persistence/fileDAO';
import {Model} from '../entities/model';
import {DataAccessProvider} from '../persistence/dataAccessProvider';
import {LoadFileTask, GetOpenedFilesTask, GetValidationReportNavbar} from '../services/ModelTasks';
import {ModelComponent} from '../entities/modelTaskMetadata';
import {ValidationReport, ValidationError} from "../conformance/wrapper/ValidationReport";
import ToolbarIcon from './ToolbarIcon';
import DropdownFile from '../dropdowns/DropdownFile';
import DropdownEdit from '../dropdowns/DropdownEdit';
import DropdownView from '../dropdowns/DropdownView';
import DropdownHelp from '../dropdowns/DropdownHelp';

export class Navbar extends React.Component<NavbarWorkProps, {}> {

    allowedExtensions = ".n3,.ttl,.rdf";
    loadedFiles: string[] = [];

    // temp var
    report: ValidationReport;

    constructor(props: NavbarWorkProps) {
        super(props);
        this.iconClick = this.iconClick.bind(this);
        this.setLoadedFiles = this.setLoadedFiles.bind(this);
        this.OpenedFiles = this.OpenedFiles.bind(this);
        this.saveGraph = this.saveGraph.bind(this);

        this.ConformanceErrors = this.ConformanceErrors.bind(this);
        this.getConformanceErrors = this.getConformanceErrors.bind(this);
        this.setReport = this.setReport.bind(this);
        this.fileCallback = this.fileCallback.bind(this);
    }

    public setLoadedFiles(files: string[]) {
        if (files.length === 0) {
            console.log("no files found");
        }
        this.loadedFiles = files;
    }

    // TODO temp method
    public setReport(r: ValidationReport) {
        this.report = r;
    }

    logoutButton(event: any) {
        Auth.logout();
        // this.props.history.push("/login");
    }

    uploadDataGraphButton() {
        let input = document.getElementById("importDataGraph");
        if (input) {
            input.click();
        } else {
            console.log("Could not find element 'importDataGraph'");
        }
    }

    uploadSHACLGraphButton() {
        let input = document.getElementById("importSHACLGraph");
        if (input) {
            input.click();
        } else {
            console.log("Could not find element 'importSHACLGraph'");
        }
    }

    iconClick() {
        this.props.callback(!this.props.visible);
    }

    importDataGraph(e: any) {
        let input = (document.getElementById("importDataGraph") as HTMLInputElement);

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
            console.log("error: could not find importDataGraph button");
        }
    }

    importSHACLGraph(e: any) {
        let input = (document.getElementById("importSHACLGraph") as HTMLInputElement);

        if (input) {
            let files = input.files;
            let fileDAO = DataAccessProvider.getInstance().getFileDAO();
            if (files) {
                if (files[0]) {
                    fileDAO.find(new FileModule(ModelComponent.SHACLShapesGraph, files[0].name, files[0]));
                }
            } else {
                console.log("error: no files found");
            }
        } else {
            console.log("error: could not find importSHACLGraph button");
        }
    }

    saveGraph(e: any) {
        let model: Model = DataAccessProvider.getInstance().model;
        model.tasks.schedule(new GetOpenedFilesTask([ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph], this));
        model.tasks.processAllTasks();
    }

    // TODO temp method
    getConformanceErrors(e: any) {
        let model: Model = DataAccessProvider.getInstance().model;
        model.tasks.schedule(new GetValidationReportNavbar(this));
        model.tasks.processAllTasks();
    }

    getFileFromPopup(e: any) {
        let fileName = (e.target || e.srcElement).innerHTML;
        console.log(fileName);
        let model: Model = DataAccessProvider.getInstance().model;
        model.tasks.schedule(new LoadFileTask([ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph], fileName));
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
            return <label>No files currently opened in the editor </label>;
        }

        return (
            <div>
                <label>Files that are currently opened in the editor: </label>
                <br/>
                <List items={items}/>
            </div>
        );
    }

    /*
    * Temp method for showing conformance errors
    * TODO later show conformance errors in mxGraph
    */
    ConformanceErrors(props: any) {
        if (!this.report) {
            return (
                <label>No conformance report generated yet</label>
            );
        }

        let items: any[] = [];
        let tmp: ValidationError[] = this.report.getValidationErrors();
        for (let i = 0; i < tmp.length; i++) {
            let cur = tmp[i].toString();
            // TODO in the future handle the object better instead of just calling toString()
            items.push(
                <li key={cur}>
                    {cur}
                </li>
            );
        }

        if (items.length === 0) {
            return <label>No conformance errors </label>;
        }

        return (
            <div>
                <label>Conformance errors: </label>
                <br/>
                <List items={items}/>
            </div>
        );
    }

    /* Function used as a callback from the child componente for the file dropdown option */
    fileCallback (childData: any) {
        if (childData === "shacl") {
            this.uploadSHACLGraphButton();
        } else if (childData === "data") {
            this.uploadDataGraphButton();

        }
        console.log(childData);
    }

    render() {

        return (
            <div>
                {/* General Toolbar */}
                <Menu
                    inverted={true}
                    size="tiny"
                    style={{
                        borderRadius: 0,
                        margin: 0,
                        padding: 0
                    }}
                    borderless={true}
                >
                    <Menu.Item as="a" onClick={this.iconClick} content={<Icon name='content'/>}/>
                    {/* Toolbar 'File' */}
                    <Menu.Item>
                        <DropdownFile opened_files={<this.OpenedFiles/>} import_cb={this.fileCallback}/>
                        {/* Import SHACL Graph input*/}
                        <input
                            onChange={this.importSHACLGraph}
                            type="file"
                            id="importSHACLGraph"
                            style={{"display": "none"}}
                            accept={this.allowedExtensions}
                        />
                        {/* Import Data graph input*/}
                        <input
                            onChange={this.importDataGraph}
                            type="file"
                            id="importDataGraph"
                            style={{"display": "none"}}
                            accept={this.allowedExtensions}
                        />
                    </Menu.Item>
                    {/* Toolbar 'Edit' */}
                    <Menu.Item>
                        <DropdownEdit/>
                    </Menu.Item>
                    {/* Toolbar 'View' */}
                    <Menu.Item>
                        <DropdownView/>
                    </Menu.Item>
                    {/* Toolbar 'Help' */}
                    <Menu.Item>
                        <DropdownHelp/>
                    </Menu.Item>
                    {/* Toolbar 'Github repo' */}
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
                    {/* Toolbar 'Github re' */}
                    <Menu.Item
                        as="a"
                        target="_blank"
                        href="https://github.com/dubious-developments/UnSHACLed/wiki/Release-notes"
                    >
                        v0.5
                    </Menu.Item>
                    <Menu.Item
                        as={Link}
                        to="/login"
                        onClick={(event) => this.logoutButton(event)}
                    >
                        Logout
                    </Menu.Item>
                </Menu>
                {/* Toolbar icons menu */}
                <Menu
                    inverted={true}
                    size="mini"
                    icon={true}
                    borderless={true}
                    style={{
                        borderRadius: 0,
                        margin: 0,
                        padding: 0
                    }}
                >
                    {/* Toolbar icons */}
                    {/* Zoom in */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Zoom in"}
                        t_id={"zoom in"}
                        icon_name={"search"}
                    />
                    {/* Zoom out */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Zoom out"}
                        t_id={"zoom out"}
                        icon_name={"search"}
                    />
                    {/* Undo */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Undo last action"}
                        t_id={"undo"}
                        icon_name={"reply"}
                    />
                    {/* Redo */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Redo last action"}
                        t_id={"redo"}
                        icon_name={"share"}
                    />
                    {/* Delete */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Delete selected component(s) from graph"}
                        t_id={"delete"}
                        icon_name={"trash"}
                    />
                    {/* snapshot */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Generate snap shot of current graph"}
                        t_id={"camera"}
                        icon_name={"camera"}
                    />
                    {/* set size */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Set current graph to actual size"}
                        t_id={"actual size"}
                        icon_name={"compress"}
                    />
                    {/* fit size */}
                    <ToolbarIcon
                        p_size={"mini"}
                        p_position={"bottom left"}
                        p_content={"Make graph fit the screen"}
                        t_id={"fit"}
                        icon_name={"expand"}
                    />

                    <Popup
                        trigger={<Menu.Item as="a" onClick={this.saveGraph}>Save Graph</Menu.Item>}
                        on="click"
                        inverted={false}
                    >
                        <this.OpenedFiles/>
                    </Popup>

                    <Popup
                        trigger={<Menu.Item as="a" onClick={this.getConformanceErrors}>Conformance errors</Menu.Item>}
                        on="click"
                        inverted={false}
                    >
                        <this.ConformanceErrors/>
                    </Popup>

                </Menu>
            </div>
        );
    }
}

export default Navbar; // withRouter(Navbar);