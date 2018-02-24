import * as Collections from "typescript-collections";
import { TaskProcessor, ProcessorTask, FifoTaskQueue } from "./taskProcessor";

/**
 * A model observer: a function that takes a change set as input
 * and produces a list of tasks to process as output.
 */
type ModelObserver = (changeBuffer: Collections.Set<ModelComponent>)
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
    public constructor(data: ModelData) {
        this.tasks = new TaskProcessor<ModelData, ModelTaskMetadata>(
            data,
            new FifoTaskQueue<ModelData, ModelTaskMetadata>(),
            (task) => task,
            (task) => this.notifyObservers(data.drainChangeBuffer()));
        this.observers = [];
    }

    /**
     * Registers an observer with the model.
     */
    public registerObserver(observer: ModelObserver) {
        this.observers.push(observer);
    }

    private notifyObservers(changeBuffer: Collections.Set<ModelComponent>): void {
        this.observers.forEach(element => {
            element(changeBuffer).forEach(newTask => {
                this.tasks.schedule(newTask);
            });
        });
    }
}

/**
 * Contains a mutable view of a model.
*/
export class ModelData {
    private changeBuffer: Collections.Set<ModelComponent>;

    /**
     * A dictionary that contains all of the model's components.
     */
    private components: Collections.Dictionary<ModelComponent, any>;

    /**
     * Creates an empty model.
     */
    public constructor() {
        this.changeBuffer = new Collections.Set<ModelComponent>();
        this.components = new Collections.Dictionary<ModelComponent, any>();
    }

    /**
     * Gets a particular component of this model.
     */
    public getComponent<T>(component: ModelComponent): T {
        return this.components[component];
    }

    /**
     * Sets a particular component of this model.
     */
    public setComponent<T>(component: ModelComponent, value: T): void {
        this.components[component] = value;
        this.changeBuffer.add(component);
    }

    /**
     * Drains the model's change buffer.
     */
    public drainChangeBuffer(): Collections.Set<ModelComponent> {
        let result = this.changeBuffer;
        this.changeBuffer = new Collections.Set<ModelComponent>();
        return result;
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
