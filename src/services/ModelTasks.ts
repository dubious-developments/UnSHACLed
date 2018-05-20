import {ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {LocalFileDAO, LocalFileModule} from "../persistence/localFileDAO";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {Navbar} from "../components/navbarWork";
import { extensionToMIME } from "./extensionToMIME";
import {Task} from "../entities/task";
import MxGraph from "../components/MxGraph";
import { ImmutableGraph } from "../persistence/graph";
import { Component } from "../persistence/component";
import SideBar from "../components/Sidebar";

/**
 * First search the component which belongs to the fileName
 * Then load a file from the model using the fileName
 */
export class LoadFileTask extends Task<ModelData, ModelTaskMetadata> {

    private mComponent: ModelComponent;

    /**
     * Create a new load file task from Model
     * @param components
     * @param fileName
     */
    public constructor(private components: ModelComponent[], private fileName: string) {
        super();

    }

    public execute(data: ModelData): void {
        // first search for the component which contains the fileName
        for (let mComponent of this.components) {
            let comp: any = data.getComponent(mComponent);
            if (comp) {
                if (comp.getAllKeys().includes(this.fileName)) {
                    // found the ModelComponent
                    this.mComponent = mComponent;
                    break;
                }
            }
        }

        // now store the file if the ModelComponent is found
        if (this.mComponent in ModelComponent) {
            let component = data.getComponent(this.mComponent);
            if (component) {
                let fileDAO: LocalFileDAO = DataAccessProvider.getInstance().getLocalFileDAO();
                // get MIME based on extension
                let splitted = this.fileName.split(".");
                let blob = new Blob([], {type: extensionToMIME[splitted[splitted.length - 1]]});
                fileDAO.insert(new LocalFileModule(this.mComponent, this.fileName, blob));
            }
        }

    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph, ModelComponent.UI],
            [ModelComponent.UI]);
    }
}

/*
 * Gets a list of all opened files in the editor and update the view in the navBar
 */
export class GetOpenedFilesTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Get the loaded files in the model
     * @param components
     * @param navBar
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
        let tmp = this.components.concat();
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
     * @param mComponent
     * @param mxGraph
     */
    public constructor(private mComponent: ModelComponent, private mxGraph: MxGraph) {
        super();

    }

    public execute(data: ModelData): void {
        let component = data.getComponent<Component<ImmutableGraph>>(this.mComponent);

        if (component) {
            for (let part of component.getAllKeys()) {
                // handle the graph objects correctly
                if (this.mxGraph) {
                    if (part !== "ROOT") {
                        let persistenceGraph = component.getPart(part);

                        this.mxGraph.visualizeFile(
                            persistenceGraph, ModelComponent[this.mComponent], part, persistenceGraph.getPrefixes()
                        );

                        SideBar.setPrefixes(persistenceGraph.getPrefixes());
                    }
                } else {
                    console.log("error: could not find MxGraph");
                }
            }

            this.mxGraph.debug();
        } else {
            console.log("Could not find the ModelComponent: ", component);
        }
    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([this.mComponent, ModelComponent.UI], [ModelComponent.UI]);
    }
}

/*
 * Load the validationReport from the Model and show it in mxGraph
 */
export class GetValidationReport extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new GetValidationReport task from Model
     * @param mxGraph
     */
    public constructor(private mxGraph: MxGraph) {
        super();

    }

    public execute(data: ModelData): void {
        let component: any = data.getComponent(ModelComponent.ValidationReport);
        if (component) {
            let report = component.getRoot();
            if (this.mxGraph) {
                this.mxGraph.handleConformance(report);
            }
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
     * Create a new GetValidationReportNavbar task from Model
     * @param navBar
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

/**
 * Edits a triple and updates the corresponding part in the model
 * An edit here can be interpreted as a regular edit (e.g. change of predicate)
 * but can also be interpreted as a remove of the entire triple
 * This Task can be used for both
 */
export class EditTriple extends Task<ModelData, ModelTaskMetadata> {

    public constructor(private graph: ImmutableGraph, private type: string, private file: string) {
        super();
    }

    public execute(data: ModelData): void {
        let dataComponent = data.getComponent<Component<ImmutableGraph>>(ModelComponent.DataGraph);

        let shapesComponent = data.getComponent<Component<ImmutableGraph>>(ModelComponent.SHACLShapesGraph);

        if (this.type === "DataGraph" && dataComponent) {
            data.setComponent(ModelComponent.DataGraph, dataComponent.withPart(
                this.file, this.graph));
        } else if (shapesComponent) {
            data.setComponent(ModelComponent.SHACLShapesGraph, shapesComponent.withPart(
                this.file, this.graph));
        }
    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [ModelComponent.UI, ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph],
            [ModelComponent.UI, ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph]);
    }
}
