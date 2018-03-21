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
    /**
     * The task processor for the model.
     * 
     * NOTE: don't try to run tasks on the Model immediately by calling
     * `processTask`. There are two reasons for why this is a bad idea:
     * 
     *   * The UI should call `processTask` when it knows that
     *     it has time to do some processing. Other components shouldn't.
     * 
     *   * More fundamentally, tasks are not processed in a LIFO order,
     *     so the task you're trying to process using `processTask` may
     *     not be the task you queued.
     */
    public readonly tasks: TaskProcessor<ModelData, ModelTaskMetadata>;

    private observers: ModelObserver[];

    /**
     * Creates a model.
     * 
     * NOTE: an application like UnSHACLed should contain only *one*
     * Model instance. If you're in doubt about whether you should
     * create a new Model instance or not, you probably shouldn't.
     * Grab a Model from a singleton somewhere.
     * 
     * This constructor exists mostly for testing purposes.
     */
    public constructor(data?: ModelData) {
        if (!data) {
            data = new ModelData();
        }
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
    public registerObserver(observer: ModelObserver): void {
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
        return this.components.getValue(component);
    }

    /**
     * Sets a particular component of this model.
     */
    public setComponent<T>(component: ModelComponent, value: T): void {
        this.components.setValue(component, value);
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
 * An enumeration of components in the model.
 */
export enum ModelComponent {
    DataGraph, ShapesGraph, ValidationReport
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
