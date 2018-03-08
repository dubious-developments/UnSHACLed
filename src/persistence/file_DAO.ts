import {Parser} from "./parser";
import {Writer} from "./writer";
import {Graph} from "./graph";
import {Model, ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {ProcessorTask} from "../entities/taskProcessor";

/**
 * Provides basic DAO functionality at the file granularity level.
 */
export class FileDAO implements DataAccessObjectInterface {
    private model: Model;
    private io: IOFacilitator;

    /**
     * Create a new FileDAO
     */
    public constructor() {
        this.io = new IOFacilitator();
    }

    /**
     * Create a new file.
     * @param {Blob} file
     */
    public insert(file: Blob) {
        this.model.tasks.schedule(new PullTask(this.io));
    }

    /**
     * Load an existing file.
     * @param {Blob} file
     */
    public find(file: Blob) {
        this.model.tasks.schedule(new PushTask(this.io, file));
    }

    /**
     * Save an existing file.
     * @param {Blob} file
     */
    public update(file: Blob) {
        this.insert(file);
    }
}

/**
 * Provides basic input/output functionality w.r.t. files.
 */
class IOFacilitator {
    private parser: Parser;
    private writer: Writer;

    public constructor() {
        this.parser = new Parser();
        this.writer = new Writer();
    }

    /**
     * Read from an existing file.
     * @param {Blob} file
     * @returns {Graph}
     */
    public readFromFile(file: Blob) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = onLoadFunction;
        reader.onloadend = onLoadEndFunction;

        let parser = this.parser;
        let store = null;
        function onLoadFunction(evt: any) {
            parser.parse(evt.target.result);
        }

        function onLoadEndFunction(evt: any) {
            store = parser.getStore();
            parser.prepare();
        }

        return new Graph(store, file);
    }

    /**
     * Write to a file (not necessarily extant).
     * @param {Graph} graph
     */
    public writeToFile(graph: Graph) {
        let FileSaver = require("file-saver");
        let content = this.writer.write(graph.getStore());

        let file = new File([content], graph.getFile(), graph.getFile().type);
        FileSaver.saveAs(file);
    }
}

/**
 * A ProcessorTask that loads a graph structure into the Model.
 */
class PushTask extends ProcessorTask<ModelData, ModelTaskMetadata> {
    public constructor(io: IOFacilitator, file: Blob) {
        super(function(data: ModelData) {
            data.setComponent(ModelComponent.DataGraph, io.readFromFile(file));
        },    null);
    }
}

/**
 * A ProcessorTask that requests a graph structure from the Model.
 */
class PullTask extends ProcessorTask<ModelData, ModelTaskMetadata> {
    public constructor(io: IOFacilitator) {
        super(function(data: ModelData) {
            io.writeToFile(data.getComponent(ModelComponent.DataGraph));
        },    null);
    }
}
