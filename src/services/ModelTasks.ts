import {ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {FileDAO, FileModule} from "../persistence/fileDAO";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {Component} from "../persistence/component";
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
            fileDAO.insert(new FileModule(ModelComponent.DataGraph, this.fileName, blob));
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
     * @param {c} ModelComponent
     * @param {navBar} the frontend component
     */
    public constructor(private mComponent: ModelComponent, private navBar: Navbar) {
        super();
    }

    public execute(data: ModelData): void {
        if (this.navBar) {
            let component: any = data.getComponent(this.mComponent);
            if (component) {
                this.navBar.setLoadedFiles(component.getAllKeys());
            }
        } else {
            console.log("error: navBar not defined");
        }
    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([this.mComponent, ModelComponent.IO], [ModelComponent.IO]);
    }

}

/*
 * Load a certain ModelComponent's data from the model
 */
export class LoadComponent extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new LoadComponent task from Model
     * @param {mComponent} ModelComponent
     * @param {mxGraph} MxGraph
     */
    public constructor(private mComponent: ModelComponent, private mxGraph: MxGraph) {
        super();

    }

    public execute(data: ModelData): void {
        console.log("called");
        let component: any = data.getComponent(this.mComponent);
        if (component) {

            let tmp = component.getAllKeys();
            for (let part of tmp) {
                // handle the graph objects correctly
                if (this.mxGraph) {
                    let store = component.getPart(part).rdfLibStore;
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