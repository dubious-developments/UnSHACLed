/// <reference path="./dataAccessObject.d.ts"/>
/// <reference path="./parser.d.ts"/>

import * as Collections from "typescript-collections";
import {Model, ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {ProcessorTask} from "../entities/taskProcessor";
import {Component} from "./component";
import {GraphParser} from "./graphParser";

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
        this.io.readFromFile(module, function(result: any) {
            self.model.tasks.schedule(new LoadTask(result, module));
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
        let reader = new FileReader();
        reader.readAsText(module.getTarget());
        reader.onload = onLoadFunction;

        let parser = this.parsers.getValue(module.getType());
        parser.clean();
        // every time a portion is loaded, parse this portion of content
        // and aggregate the result (this happens internally).
        function onLoadFunction(evt: any) {
            parser.parse(evt.target.result, module.getTarget().type, save);
        }
    }

    /**
     * Write to a file.
     * @param module
     * @param data
     */
    public writeToFile(module: Module, data: any) {
        let FileSaver = require("file-saver");
        this.parsers.getValue(module.getType()).serialize(
            data, module.getTarget().type,
            function(result: string) {
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
}

/**
 * A ProcessorTask that reads a file and adds its contents as a component to the Model.
 */
class LoadTask extends ProcessorTask<ModelData, ModelTaskMetadata> {

    /**
     * Create a new LoadTask.
     * Contains a function that will execute on the model.
     * This function saves information to the model, which was read from file.
     * @param result
     * @param {FileModule} module
     */
    public constructor(result: any, module: Module) {
        super(function(data: ModelData) {
            let component: Component = data.getComponent(module.getType());
            if (!component) {
                component = new Component();
            }
            component.setPart(module.getName(), result);
            data.setComponent(module.getType(), component);
        },    null);
    }
}

/**
 * A ProcessorTask that retrieves a component from the Model and writes its contents to a file.
 */
class SaveTask extends ProcessorTask<ModelData, ModelTaskMetadata> {

    /**
     * Create a new SaveTask.
     * Contains a function that will execute on the model.
     * This function loads information from the model and writes this to file.
     * @param {IOFacilitator} io
     * @param {FileModule} module
     */
    public constructor(io: IOFacilitator, module: Module) {
        super(function(data: ModelData) {
            let component: Component = data.getComponent(module.getType());
            if (component) {
                let part = component.getPart(module.getName());
                if (part) {
                    io.writeToFile(module, part);
                }
            }
        },    null);
    }
}