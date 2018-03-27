import {ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {FileDAO, FileModule} from "../persistence/fileDAO";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {Component} from "../persistence/component";
import {Navbar} from "../components/navbarWork";
import { extensionToMIME } from "./extensionToMIME";
import {Task} from "../entities/task";

/*
 *
 */
export class LoadFileTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new load file task from Model
     * Contains a function that will execute on the model.
     * @param {mComponent} ModelComponent
     */
    public constructor(private mComponent: ModelComponent, private fileName: string) {
        super();

    }

    public execute(data: ModelData): void {
        let component: Component = data.getComponent(this.mComponent);
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
 *
 */
export class GetOpenedFilesTask extends Task<ModelData, ModelTaskMetadata> {

    public execute(data: ModelData): void {
        if (this.navBar) {
            let component: Component = data.getComponent(this.mComponent);
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

    /**
     * Get the loaded files in the model
     * Contains a function that will execute on the model.
     * @param {c} ModelComponent
     * @param {f} module
     */
    public constructor(private mComponent: ModelComponent, private navBar: Navbar) {
        super();
    }

}