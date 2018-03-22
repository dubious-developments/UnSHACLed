import * as Collections from "typescript-collections";
import { TaskProcessor, ProcessorTask, FifoTaskQueue } from "./taskProcessor";
import { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";
export { ModelData } from "./modelData";

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
     * Registers an observer with the model. Observers are notified when
     * a task completes and may queue additional tasks based on the changes
     * made to components.
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
