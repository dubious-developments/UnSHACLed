import {ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {FileDAO, FileModule} from "../persistence/fileDAO";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {Navbar} from "../components/navbarWork";
import { extensionToMIME } from "./extensionToMIME";
import {Task} from "../entities/task";
import MxGraph from "../components/MxGraph";

/*
 * Load a file from the model using the fileName
 */
export class LoadFileTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new load file task from Model
     * @param {mComponent} ModelComponent
     * @param {fileName} the name of the file
     */
    public constructor(private mComponent: ModelComponent, private fileName: string) {
        super();

    }

    public execute(data: ModelData): void {
        let component: any = data.getComponent(this.mComponent);
        if (component) {
            var fileDAO: FileDAO = DataAccessProvider.getInstance().getFileDAO();
            // get MIME based on extension
            var splitted = this.fileName.split(".");
            var blob = new Blob([], {type: extensionToMIME[splitted[splitted.length - 1]]});
            fileDAO.insert(new FileModule(this.mComponent, this.fileName, blob));
        }

    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([this.mComponent, ModelComponent.UI], [ModelComponent.UI]);
    }
}

/*
 * Gets a list of all opened files in the editor and update the view in the navBar
 */
export class GetOpenedFilesTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Get the loaded files in the model
     * @param {components} array of ModelComponents
     * @param {navBar} the frontend component
     */
    public constructor(private components: ModelComponent[], private navBar: Navbar) {
        super();
    }

    public execute(data: ModelData): void {
        if (this.navBar) {
            let res: string[] = [];
            for (let tmp of this.components) {
                let component: any = data.getComponent(tmp);
                if (component) {
                    for (let key of component.getAllKeys()) {
                        if (key !== "ROOT") {
                            res.push(key);
                        }
                    }
                }
            }
            this.navBar.setLoadedFiles(res);
        } else {
            console.log("error: navBar not defined");
        }
    }

    public get metadata(): ModelTaskMetadata {
        let tmp = this.components;
        tmp.push(ModelComponent.IO);
        return new ModelTaskMetadata(tmp, [ModelComponent.IO]);
    }

}

/*
 * Load a certain ModelComponent's data from the model and visualize it
 */
export class VisualizeComponent extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new VisualizeComponent task from Model
     * @param {mComponent} ModelComponent
     * @param {mxGraph} MxGraph
     */
    public constructor(private mComponent: ModelComponent, private mxGraph: MxGraph) {
        super();

    }

    public execute(data: ModelData): void {
        let component: any = data.getComponent(this.mComponent);
        if (component) {

            let tmp = component.getAllKeys();
            for (let part of tmp) {
                // handle the graph objects correctly
                if (this.mxGraph) {
                    let store = component.getPart(part).getSHACLStore();
                    this.mxGraph.visualizeDataGraph(store);
                } else {
                    console.log("error: could not find MxGraph");
                }
            }
        } else {
            console.log("Could not find the ModelComponent: ", component);
        }

    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([this.mComponent, ModelComponent.UI], [ModelComponent.UI]);
    }
}

/*
 * Load the validationReport from the Model
 */
export class GetValidationReport extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new VisualizeComponent task from Model
     * @param {mxGraph} MxGraph
     */
    public constructor(private mxGraph: MxGraph) {
        super();

    }

    public execute(data: ModelData): void {
        let component: any = data.getComponent(ModelComponent.ValidationReport);
        if (component) {
            let report = component.getRoot();
            this.mxGraph.handleConformance(report);
        } else {
            console.log("Could not find the ModelComponent: ", ModelComponent.ValidationReport);
        }

    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([ModelComponent.ValidationReport, ModelComponent.UI], [ModelComponent.UI]);
    }
}

/*
 * TODO Temp task to show conformance errors in navbar
 */
export class GetValidationReportNavbar extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new VisualizeComponent task from Model
     * @param {navbar} NavBar
     */
    public constructor(private navBar: Navbar) {
        super();

    }

    public execute(data: ModelData): void {
        let component: any = data.getComponent(ModelComponent.ValidationReport);
        if (component) {
            let report = component.getRoot();
            if (this.navBar) {
                this.navBar.setReport(report);
            } else {
                console.log("Error, component navBar not found: ", this.navBar);
            }
        } else {
            console.log("Could not find the ModelComponent: ", ModelComponent.ValidationReport);
        }

    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([ModelComponent.ValidationReport, ModelComponent.UI], [ModelComponent.UI]);
    }
}