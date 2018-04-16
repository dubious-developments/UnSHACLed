/// <reference path="./dataAccessObject.d.ts"/>
/// <reference path="./parser.d.ts"/>

import * as Collections from "typescript-collections";
import { Model, ModelData, ModelTask } from "../entities/model";
import { ModelTaskMetadata, ModelComponent } from "../entities/modelTaskMetadata";
import { Component } from "./component";
import { GraphParser } from "./graphParser";
import { Task } from "../entities/task";
import {extensionToMIME} from "../services/extensionToMIME";

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
    }

    /**
     * Create a new file.
     * @param module
     */
    public insert(module: Module) {
        this.model.tasks.schedule(new SaveTask(this.io, module));
        this.model.tasks.processTask(); // TODO: Remove this when we have a scheduler!
    }

    /**
     * Load an existing file.
     * @param module
     */
    public find(module: Module) {
        let self = this;
        this.io.readFromFile(module, function (result: any) {
            // TODO: what is `LoadTask`s type argument? It probably shouldn't
            // be `LoadTask<any>`.
            self.model.tasks.schedule(new LoadTask<any>(result, module));
            self.model.tasks.processTask(); // TODO: Remove this when we have a scheduler!
        });
    }
}

/**
 * Provides basic input/output functionality w.r.t. files.
 * Requires a particular parser to modulate between file format and internal representation.
 */
class IOFacilitator {
    private parsers: Collections.Dictionary<ModelComponent, Parser>;

    /**
     * Create a new IOFacilitator.
     */
    public constructor() {
        this.parsers = new Collections.Dictionary<ModelComponent, Parser>();
    }

    public registerParser(label: ModelComponent, parser: Parser) {
        this.parsers.setValue(label, parser);
    }

    /**
     * Read from an existing file.
     * @returns {Graph}
     * @param module
     * @param save
     */
    public readFromFile(module: Module, save: (result: any) => void) {
        let parser = this.parsers.getValue(module.getType());
        if (!parser) {
            throw new Error("Cannot read unknown format '" + module.getType() + "'");
        }

        let wellDefinedParser = parser;
        wellDefinedParser.clean();

        // every time a portion is loaded, parse this portion of content
        // and aggregate the result (this happens internally).
        function onLoadFunction(evt: any) {
            wellDefinedParser.parse(evt.target.result, module.getMime(), save);
        }

        let reader = new FileReader();
        reader.readAsText(module.getTarget());
        reader.onload = onLoadFunction;
    }

    /**
     * Write to a file.
     * @param module
     * @param data
     */
    public writeToFile(module: Module, data: any) {
        let FileSaver = require("file-saver");
        let parser = this.parsers.getValue(module.getType());
        if (!parser) {
            throw new Error("Cannot serialize to unknown format '" + module.getType() + "'");
        }

        parser.serialize(
            data, module.getMime(),
            function (result: string) {
                // write to file
                let file = new File([result], module.getName());
                FileSaver.saveAs(file);
            });
    }
}

/**
 * A single persistence directive.
 * Contains all the necessary information to carry out a persistence operation.
 */
export class FileModule implements Module {
    private type: ModelComponent;
    private filename: string;
    private file: Blob;

    /**
     * Create a new FileModule.
     * @param {ModelComponent} type
     * @param {string} filename
     * @param {Blob} file
     */
    public constructor(type: ModelComponent, filename: string, file: Blob) {
        this.type = type;
        this.filename = filename;
        this.file = file;
    }

    /**
     * Return the designated ModelComponent.
     * @returns {ModelComponent}
     */
    getType(): ModelComponent {
        return this.type;
    }

    /**
     * Return the filename.
     * @returns {string}
     */
    getName(): string {
        return this.filename;
    }

    /**
     * Return the Blob representing the file.
     * @returns {Blob}
     */
    getTarget(): Blob {
        return this.file;
    }

    /**
     * Returns the MIME type
     * @returns {string}
     */
    getMime(): string {
        let mime = this.file.type;
        // this happens when file type can not be determined
        if (mime === "") {
            // set the type using the extension
            var splitted = this.filename.split(".");
            mime = extensionToMIME[splitted[splitted.length - 1]];
        }
        return mime;
    }
}

/**
 * A Task that reads a file and adds its contents as a component to the Model.
 */
class LoadTask<T> extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new LoadTask.
     * Contains a function that will execute on the model.
     * This function saves information to the model, which was read from file.
     * @param result
     * @param {FileModule} module
     */
    public constructor(
        private readonly result: T,
        public readonly module: Module) {

        super();
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        let component = data.getOrCreateComponent(
            this.module.getType(),
            () => new Component<T>());

        data.setComponent(
            this.module.getType(),
            component.withPart(this.module.getName(), this.result));
    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [ModelComponent.DataGraph, ModelComponent.IO],
            [ModelComponent.DataGraph, ModelComponent.IO]);
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
        // TODO: what is `Component`s type argument here? It probably
        // shouldn't be `any`.
        let component = data.getComponent<Component<any>>(this.module.getType());
        if (component) {
            let part = component.getPart(this.module.getName());
            if (part) {
                this.io.writeToFile(this.module, part);
            }
        }
    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [ModelComponent.DataGraph, ModelComponent.IO],
            [ModelComponent.IO]);
    }
}
