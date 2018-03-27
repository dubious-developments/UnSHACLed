import {ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {FileDAO, FileModule} from "../persistence/fileDAO";
import {ProcessorTask} from "../entities/taskProcessor";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {Component} from "../persistence/component";
import {Navbar} from "../components/navbarWork";
import { extensionToMIME } from "./extensionToMIME";

/*
 *
 */
export class LoadFileTask extends ProcessorTask<ModelData, ModelTaskMetadata> {

    /**
     * Create a new load file task from Model
     * Contains a function that will execute on the model.
     * @param {mComponent} ModelComponent
     */
    public constructor(mComponent: ModelComponent, fileName: string) {
        super(function(data: ModelData) {
            let component: Component = data.getComponent(mComponent);
            if (component) {
                var fileDAO: FileDAO = DataAccessProvider.getInstance().getFileDAO();
                // get MIME based on extension
                var splitted = fileName.split(".");
                var blob = new Blob([], {type: extensionToMIME[splitted[splitted.length - 1]]});
                fileDAO.insert(new FileModule(ModelComponent.DataGraph, fileName, blob));
            }
        },    null);
    }
}
/*
 *
 */
export class GetOpenedFilesTask extends ProcessorTask<ModelData, ModelTaskMetadata> {

    /**
     * Get the loaded files in the model
     * Contains a function that will execute on the model.
     * @param {c} ModelComponent
     * @param {f} module
     */
    public constructor(c: ModelComponent, navBar: Navbar) {
        super(function(data: ModelData) {
            if (navBar) {
                let component: Component = data.getComponent(c);
                if (component) {
                    navBar.setLoadedFiles(component.getAllKeys());
                }
            } else {
                console.log("error: navBar not defined");
            }
        },    null);
    }
}