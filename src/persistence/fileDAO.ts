/// <reference path="./parser.ts"/>

import * as Collections from "typescript-collections";
import { ModelTaskMetadata, ModelComponent } from "../entities/modelTaskMetadata";
import {Component} from "./component";
import { GraphParser } from "./graphParser";
import { DataAccessObject, Module } from "./dataAccessObject";
import { Task } from "../entities/task";
import {Model} from "../entities/model";
import {ModelData} from "../entities/modelData";
import {extensionToMIME} from "../services/extensionToMIME";
import { ImmutableGraph, Graph } from "./graph";
import {WorkspaceParser} from "./workspaceParser";

/**
 * Provides basic DAO functionality at the file granularity level.
 */
export class FileDAO implements DataAccessObject {

    private model: Model;
    private io: IOFacilitator;

    /**
     * Create a new FileDAO
     */
    public constructor(model: Model) {
        this.model = model;
        this.io = new IOFacilitator();

        // register parsers
        this.io.registerParser(ModelComponent.DataGraph, new GraphParser());
        this.io.registerParser(ModelComponent.SHACLShapesGraph, new GraphParser());
        this.io.registerParser(ModelComponent.Workspace, new WorkspaceParser());
    }

    /**
     * Create a new file.
     * @param module
     */
    public insert(module: Module) {
        this.model.tasks.schedule(new SaveTask(this.io, module));
        this.model.tasks.processAllTasks();
    }

    /**
     * Create a new file containing the current workspace.
     */
    public insertWorkspace(module: Module) {
        this.model.tasks.schedule(new SaveWorkspaceTask(this.io, module));
        this.model.tasks.processAllTasks();
    }

    /**
     * Load an existing file.
     * @param module
     */
    public find(module: Module): void {
        let self = this;
        this.io.readFromFile(module, function (result: Graph) {
            self.model.tasks.schedule(new LoadTask(result.asImmutable(), module));
            self.model.tasks.processAllTasks();
        });
    }

    /**
     * Load the workspace from a file.
     * @param {Module} module
     */
    public findWorkspace(module: Module) {
        let self = this;
        this.io.readFromFile(module, function (result: ModelData) {
            self.model.tasks.schedule(new LoadWorkspaceTask(result));
            self.model.tasks.processAllTasks();
        });
    }
}

/**
 * Provides basic input/output functionality w.r.t. files.
 * Requires a particular parser to modulate between file format and internal representation.
 */
export class IOFacilitator {

    private parsers: Collections.Dictionary<ModelComponent, Parser<any>>;

    /**
     * Create a new IOFacilitator.
     */
    public constructor() {
        this.parsers = new Collections.Dictionary<ModelComponent, Parser<any>>();
    }

    /**
     * Register a parser with this IOFacilitator.
     * @param {ModelComponent} label
     * @param {Parser<Graph>} parser
     */
    public registerParser(label: ModelComponent, parser: Parser<any>) {
        this.parsers.setValue(label, parser);
    }

    /**
     * Retrieve the parsers associated with this IOFacilitator.
     * @returns {Dictionary<ModelComponent, Parser<any>>}
     */
    public getParsers(): Collections.Dictionary<ModelComponent, Parser<any>> {
        return this.parsers;
    }

    /**
     * Read from an existing file.
     * @param module
     * @param load
     */

    public readFromFile(module: Module, load: (result: any) => void) {
        let parser = this.parsers.getValue(module.getTarget());
        if (!parser) {
            throw new Error("Unsupported target " + module.getTarget());
        }

        let wellDefinedParser = parser;
        wellDefinedParser.clean();

        // every time a portion is loaded, parse this portion of content
        // and aggregate the result (this happens internally).
        function onLoadFunction(evt: any) {
            wellDefinedParser.parse(evt.target.result, module.getMime(), load);
        }

        let reader = new FileReader();
        reader.readAsText(module.getContent());
        reader.onload = onLoadFunction;
    }

    /**
     * Write to a file.
     * @param module
     * @param data
     */
    public writeToFile(module: Module, data: any) {
        let FileSaver = require("file-saver");
        let parser = this.parsers.getValue(module.getTarget());
        if (!parser) {
            throw new Error("Unsupported target " + module.getTarget());
        }

        parser.serialize(
            data, module.getMime(),
            function (result: string) {
                // write to file
                let file = new Blob([result], {type: module.getMime()});
                FileSaver.saveAs(file, module.getIdentifier());
            });
    }
}

/**
 * A single persistence directive.
 * Contains all the necessary information to carry out a persistence operation.
 */
export class FileModule implements Module {
    private target: ModelComponent;
    private filename: string;
    private file: Blob;

    /**
     * Create a new FileModule.
     * @param {ModelComponent} target
     * @param {string} filename
     * @param {Blob} file
     */
    public constructor(target: ModelComponent, filename: string, file: Blob) {
        this.target = target;
        this.filename = filename;
        this.file = file;
    }

    /**
     * Return the designated ModelComponent.
     */
    getTarget(): ModelComponent {
        return this.target;
    }

    /**
     * Return the filename.
     */
    getIdentifier(): string {
        return this.filename;
    }

    /**
     * Return the Blob representing the file.
     */
    getContent(): Blob {
        return this.file;
    }

    /**
     * Returns the MIME type
     */
    getMime(): string {
        let mime = this.file.type;
        // this happens when file type can not be determined
        if (mime === "") {
            // set the type using the extension
            let split = this.filename.split(".");
            mime = extensionToMIME[split[split.length - 1]];
        }
        return mime;
    }
}

/**
 * A Task that reads a file and adds its contents as a component to the Model.
 * Also adds to the pseudo IO component so that observers know IO changes have happened.
 */
class LoadTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new LoadTask.
     * Contains a function that will execute on the model.
     * This function saves information to the model, which was read from file.
     * @param result
     * @param {FileModule} module
     */
    public constructor(
        private readonly result: ImmutableGraph,
        public readonly module: Module) {

        super();
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {

        let component = data.getOrCreateComponent(
            this.module.getTarget(),
            () => new Component<ImmutableGraph>()
        );

        data.setComponent(
            this.module.getTarget(),
            component.withPart(this.module.getIdentifier(), this.result)
        );

        // changes the IO pseudo component
        // that way IO observers know that changes have happened
        let ioComponent = data.getOrCreateComponent(
            ModelComponent.IO,
            () => new Component<ImmutableGraph>()
        );

        // the IO component will always store the file as loaded
        data.setComponent(
            ModelComponent.IO,
            ioComponent.withPart(this.module.getIdentifier(), this.result)
        );

    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [this.module.getTarget(), ModelComponent.IO],
            [this.module.getTarget(), ModelComponent.IO]);
    }
}

/**
 * A Task that loads a workspace from a file and sets the state of the Model accordingly.
 */
class LoadWorkspaceTask extends Task<ModelData, ModelTaskMetadata> {

    public constructor(private readonly workspace: ModelData) {
        super();
    }

    public execute(data: ModelData): void {
        let SHACLComponent = this.workspace.getOrCreateComponent(
            ModelComponent.SHACLShapesGraph,
            () => new Component<ImmutableGraph>()
        );

        let dataComponent = this.workspace.getOrCreateComponent(
            ModelComponent.DataGraph,
            () => new Component<ImmutableGraph>()
        );

        let ioComponent = this.workspace.getOrCreateComponent(
            ModelComponent.IO,
            () => new Component<ImmutableGraph>()
        );

        data.setComponent(
            ModelComponent.SHACLShapesGraph,
            SHACLComponent
        );

        data.setComponent(
            ModelComponent.DataGraph,
            dataComponent
        );

        data.setComponent(
            ModelComponent.IO,
            ioComponent
        );
    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([ModelComponent.SHACLShapesGraph, ModelComponent.DataGraph, ModelComponent.IO],
            [ModelComponent.SHACLShapesGraph, ModelComponent.DataGraph, ModelComponent.IO]);
    }

}

/**
 * A Task that retrieves a component from the Model and writes its contents to a file.
 */
class SaveTask extends Task<ModelData, ModelTaskMetadata> {
    /**
     * Create a new SaveTask.
     * Contains a function that will execute on the model.
     * This function loads information from the model and writes this to file.
     * @param {IOFacilitator} io
     * @param {FileModule} module
     */
    public constructor(
        private readonly io: IOFacilitator,
        public readonly module: Module) {

        super();
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        let component = data.getComponent<Component<ImmutableGraph>>(this.module.getTarget());
        if (component) {
            let part = component.getPart(this.module.getIdentifier());
            if (part) {
                this.io.writeToFile(this.module, part.toMutable());
            }
        }
    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [this.module.getTarget(), ModelComponent.IO],
            [ModelComponent.IO]);
    }
}

/**
 * A task that saves the workspace to a file.
 */
class SaveWorkspaceTask extends Task<ModelData, ModelTaskMetadata> {

    public constructor(private readonly io: IOFacilitator,
                       private readonly module: Module) {
        super();
    }

    public execute(data: ModelData): void {
        this.io.writeToFile(this.module, data);
    }

    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([ModelComponent.SHACLShapesGraph, ModelComponent.DataGraph, ModelComponent.IO],
            [ModelComponent.SHACLShapesGraph, ModelComponent.DataGraph, ModelComponent.IO]);
    }

}
