import * as Collections from "typescript-collections";
import * as Immutable from "immutable";
import {TaskProcessor} from "./taskProcessor";
import {ModelComponent, ModelTaskMetadata} from "./modelTaskMetadata";
import {ModelData} from "./modelData";
import {OpaqueTask} from "./task";
import {ModelTask, OpaqueModelTask} from "./taskInstruction";
import {OutOfOrderProcessor} from "./outOfOrderProcessor";
import {CausalityChain} from "./causalityChain";

export { ModelData } from "./modelData";
export { ModelTask, OpaqueModelTask } from "./taskInstruction";
export { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";

/**
 * A model observer: a function that takes a change set as input
 * and produces a list of tasks to process as output.
 */
export class ModelObserver {

    private static counter: number = 0;
    private identifier: number;

    /**
     * Create a new Model Observer.
     * @param {(changeBuffer: Set<ModelComponent>) => Array<ModelTask>} observer
     */
    public constructor(private readonly observer: (changeBuffer: Immutable.Set<ModelComponent>) => Array<ModelTask>) {
        this.identifier =
        ModelObserver.counter++;
    }

    /**
     * Retrieve the identifier.
     * @returns {number}
     */
    public getID(): number {
        return this.identifier;
    }

    /**
     * Observe changes reported by the model and react accordingly.
     * @param {Set<ModelComponent>} changeBuffer
     * @returns {Array<ModelTask>}
     */
    public observe(changeBuffer: Immutable.Set<ModelComponent>): Array<ModelTask> {
        return this.observer(changeBuffer);
    }
}

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

    private chain: CausalityChain<ModelComponent, number>;

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
        let wellDefinedData = !data ? new ModelData() : data;
        this.tasks = new OutOfOrderProcessor(
            wellDefinedData,
            task => task,
            (task: ModelTask) => task,
            (task: ModelTask) => {
                // Drain the read/write buffers.
                let buffers = wellDefinedData.drainBuffers();
                
                // Check that the read/write buffers match the behavior
                // specified by the task metadata.
                buffers.readBuffer.toArray().forEach(element => {
                    if (!task.metadata.readsFrom(element)) {
                        // Looks like the task read from an element that
                        // it doesn't have access to.
                        throw Error(
                            `${task} read from ${element}, which is not in its read set. ` +
                            `Consider adding ${element} to the read set if the read is intentional.`);
                    }
                });
                buffers.writeBuffer.toArray().forEach(element => {
                    if (!task.metadata.writesTo(element)) {
                        // Looks like the task write to an element that
                        // it doesn't have access to.
                        throw Error(
                            `${task} wrote to ${element}, which is not in its write set. ` +
                            `Consider adding ${element} to the write set if the write is intentional.`);
                    }
                });
                task.metadata.writeSet.toArray().forEach(element => {
                    // Components that are written to must either be
                    // in the read set, in the write buffer, or both.
                    if (!task.metadata.readSet.contains(element)
                        && !buffers.writeBuffer.contains(element)) {
                            throw Error(
                                `${task} does not write to ${element}, which is in the ` +
                                `write set but not in the read set. Consider adding ${element} ` +
                                `to the read set if no write is the intended behavior.`);
                    }
                });

                // Notify observers.
                this.notifyObservers(buffers.writeBuffer);
            });
        this.observers = [];
        this.chain = new CausalityChain<ModelComponent, number>();
    }

    /**
     * Creates a task for the model.
     * @param execute The task itself: a function that manipulates model data.
     * @param readSet The set of all values from which the model task may read.
     * It includes elements in the write set that are modified based on their
     * previous value, as opposed to blindly overwritten.
     * @param writeSet The set of all values to which the model task writes.
     * @param priority An optional priority for the task.
     */
    public static createTask(
        execute: (data: ModelData) => void,
        readSet: Collections.Set<ModelComponent> | ModelComponent[],
        writeSet: Collections.Set<ModelComponent> | ModelComponent[],
        priority?: number):
        OpaqueModelTask {

        return new OpaqueTask<ModelData, ModelTaskMetadata>(
            execute,
            new ModelTaskMetadata(readSet, writeSet, priority));
    }

    /**
     * Registers an observer with the model. Observers are notified when
     * a task completes and may queue additional tasks based on the changes
     * made to components.
     */
    public registerObserver(observer: ModelObserver
        | ((changeBuffer: Immutable.Set<ModelComponent>) => Array<ModelTask>)): void {
        if (observer instanceof ModelObserver) {
            this.observers.push(observer);
        } else {
            this.observers.push(new ModelObserver(observer));
        }
    }

    /**
     * Notify all registered observers.
     * @param {Set<ModelComponent>} changeBuffer
     */
    private notifyObservers(changeBuffer: Immutable.Set<ModelComponent>): void {
        this.observers.forEach(element => {
            element.observe(changeBuffer).forEach(newTask => {
                if (!this.chain.stage(element.getID(), newTask.metadata.readSet, newTask.metadata.writeSet)) {
                    this.tasks.schedule(newTask);
                }
            });
        });
        this.chain.finalize();
    }
}