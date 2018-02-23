import * as Collections from "typescript-collections";

/**
 * An object that executes tasks on a piece of data.
*/
export class TaskProcessor<TData, TTaskMetadata> {
    private tasks: TaskQueue<TData, TTaskMetadata>;
    private data: TData;

    /**
     * Creates a task processor that manages a particular piece of data
     * and uses a particular task queue.
    */
    public constructor(data: TData, tasks?: TaskQueue<TData, TTaskMetadata>) {
        this.data = data;
        if (tasks) {
            this.tasks = tasks;
        } else {
            this.tasks = new FifoTaskQueue<TData, TTaskMetadata>();
        }
    }

    /**
     * Schedules a task for execution by this processor.
     */
    public schedule(task: ProcessorTask<TData, TTaskMetadata>): void {
        this.tasks.enqueue(task);
    }

    /**
     * Deschedules a task and executes it.
     */
    public processTask(): void {
        let task = this.tasks.dequeue();
        task.execute(this.data);
    }

    /**
     * Tells if the model's task schedule is empty.
    */
    public get isScheduleEmpty(): boolean {
        return this.tasks.isEmpty;
    }
}

/**
 * A task that can be executed on a task processor.
*/
export class ProcessorTask<TData, TTaskMetadata> {
    /**
     * Creates a model task.
     * @param execute The task itself.
     * @param metadata Information related to the task.
     */
    public constructor(
        public execute: (proc: TData) => void,
        public metadata: TTaskMetadata) { }
}

/**
 * A queue of tasks for task processors. Implementations
 * of this interface need not adhere to a FIFO scheduling policy.
*/
export interface TaskQueue<TData, TTaskMetadata> {
    /**
     * Tells if the task queue is empty.
    */
    isEmpty: boolean;

    /**
     * Adds a task to the queue.
     * @param task The task to add.
     */
    enqueue(task: ProcessorTask<TData, TTaskMetadata>): void;

    /**
     * Removes a task from the queue and returns it.
    */
    dequeue(): ProcessorTask<TData, TTaskMetadata>;
}

/**
 * A task queue that executes tasks in FIFO order.
*/
export class FifoTaskQueue<TData, TTaskMetadata> implements TaskQueue<TData, TTaskMetadata> {
    private queue: Collections.Queue<ProcessorTask<TData, TTaskMetadata>>;

    public constructor() {
        this.queue = new Collections.Queue<ProcessorTask<TData, TTaskMetadata>>();
    }

    public get isEmpty(): boolean {
        return this.queue.isEmpty();
    }

    public enqueue(task: ProcessorTask<TData, TTaskMetadata>): void {
        this.queue.enqueue(task);
    }

    public dequeue(): ProcessorTask<TData, TTaskMetadata> {
        return this.queue.dequeue();
    }
}
