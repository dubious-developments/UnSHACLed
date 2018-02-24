import * as Collections from "typescript-collections";
import { TaskProcessor, ProcessorTask } from "./taskProcessor";

/**
 * A model observer: a function that takes a change set as input
 * and produces a list of tasks to process as output.
 */
type ModelObserver = (changeSet: Collections.Set<ModelComponent>)
    => Array<ProcessorTask<ModelData, ModelTaskMetadata>>;

/**
 * Models the data handled by the UnSHACLed application.
*/
export class Model {
    private observers: ModelObserver[];

    /**
     * The task processor for the model.
     */
    public readonly tasks: TaskProcessor<ModelData, ModelTaskMetadata>;

    /**
     * Creates an empty model.
     */
    public constructor(initialDataGraph: ModelDataGraph) {
        this.tasks = new TaskProcessor<ModelData, ModelTaskMetadata>(
            new ModelData(initialDataGraph));
        this.observers = [];
    }

    /**
     * Registers an observer with the model.
     */
    public registerObserver(observer: ModelObserver) {
        this.observers.push(observer);
    }
}

/**
 * Contains a mutable view of a model.
*/
export class ModelData {
    /**
     * The data graph that is at the core of this model.
     */
    public readonly dataGraph: ModelDataGraph;

    /**
     * Creates an empty model.
    */
    public constructor(initialDataGraph: ModelDataGraph) {
        this.dataGraph = new ModelDataGraph(initialDataGraph, () => { });
    }
}

/**
 * Describes the data graph component of the model.
*/
export class ModelDataGraph {
    /**
     * Creates an empty model data graph that uses a function
     * to signal changes to the graph.
     */
    public constructor(
        private dataGraph: any,
        private signalWrite: () => void) {
    }

    /**
     * Gets the RDF graph wrapped by this object.
     */
    public get graph(): any {
        return this.dataGraph;
    }

    /**
     * Sets the RDF graph wrapped by this object.
     */
    public set graph(v: any) {
        this.dataGraph = v;
        // The model has changed. Let the rest of the world know.
        this.signalWrite();
    }
}

/**
 * An enumeration of components in the model.
*/
export enum ModelComponent {
    DataGraph,
}

/**
 * Metadata for tasks that are executed on the model.
*/
export class ModelTaskMetadata {
    public constructor(
        public readSet: Collections.Set<ModelComponent>,
        public writeSet: Collections.Set<ModelComponent>) { }

    /**
     * Tells if this model task reads from a particular component.
     * @param component The component this model task may read from.
     */
    public readsFrom(component: ModelComponent): boolean {
        return this.readSet.contains(component);
    }

    /**
     * Tells if this model task overwrites a particular component.
     * @param component The component this model will overwrite.
     */
    public writesTo(component: ModelComponent): boolean {
        return this.writeSet.contains(component);
    }
}
