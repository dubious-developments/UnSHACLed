import * as Collections from "typescript-collections";

type TaskStartedCallback<TData, TTaskMetadata> =
    (task: ProcessorTask<TData, TTaskMetadata>) => any;

type TaskCompletedCallback =
    (taskInfo: any) => void;

/**
 * An object that executes tasks on a piece of data.
 */
export class TaskProcessor<TData, TTaskMetadata> {
    private tasks: TaskQueue<TData, TTaskMetadata>;
    private data: TData;
    private onTaskStarted: TaskStartedCallback<TData, TTaskMetadata>;
    private onTaskCompleted: TaskCompletedCallback;

    /**
     * Creates a task processor that manages a particular piece of data
     * and uses a particular task queue.
     */
    public constructor(
        data: TData,
        tasks?: TaskQueue<TData, TTaskMetadata>,
        onTaskStarted?: TaskStartedCallback<TData, TTaskMetadata>,
        onTaskCompleted?: TaskCompletedCallback) {
        this.data = data;
        if (tasks) {
            this.tasks = tasks;
        } else {
            this.tasks = new FifoTaskQueue<TData, TTaskMetadata>();
        }
        if (onTaskStarted) {
            this.onTaskStarted = onTaskStarted;
        } else {
            this.onTaskStarted = (task) => undefined;
        }
        if (onTaskCompleted) {
            this.onTaskCompleted = onTaskCompleted;
        } else {
            this.onTaskCompleted = (info) => undefined;
        }
    }

    /**
     * Schedules a task for execution by this processor.
     */
    public schedule(task: ProcessorTask<TData, TTaskMetadata>): void {
        this.tasks.enqueue(task);
    }

    /**
     * Deschedules a task and executes it. Does nothing if
     * the task schedule is empty.
     */
    public processTask(): void {
        let task = this.tasks.dequeue();
        if (task === undefined) {
            return;
        }
        let info = this.onTaskStarted(task);
        task.execute(this.data);
        this.onTaskCompleted(info);
    }

    /**
     * Deschedules and executes tasks until the task schedule
     * becomes empty..
     */
    public processAllTasks(): void {
        while (!this.isScheduleEmpty) {
            this.processTask();
        }
    }

    /**
     * Deschedules and executes tasks until a particular time in
     * milliseconds has passed or the task schedule becomes empty.
     * @param milliseconds The duration in milliseconds during which tasks may be executed.
     */
    public processTasksDuring(milliseconds: number): void {
        let start = Date.now();
        let current = start;
        while (!this.isScheduleEmpty && current - start < milliseconds) {
            this.processTask();
            current = Date.now();
        }
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
    private static taskCounter = 0;

    /**
     * A task-unique index.
     *
     * NOTE: we need these indices to make sets work. JavaScript
     * arrays are stupid and assume that objects are equal iff
     * their string representations are. Additionally, string
     * representations are *structural,* so without this index,
     * the string representation for two different tasks would
     * be the same. That breaks sets and hash maps, which we can't
     * have.
     */
    public readonly index: number;

    /**
     * Creates a model task.
     * @param execute The task itself.
     * @param metadata Information related to the task.
     */
    public constructor(
        public execute: (proc: TData) => void,
        public metadata: TTaskMetadata) {

        this.index = ProcessorTask.generateTaskIndex();
    }

    private static generateTaskIndex(): number {
        return this.taskCounter++;
    }

    /**
     * Gets a string representation for this task.
     */
    public toString(): string {
        return `Task ${this.index}`;
    }
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
    dequeue(): ProcessorTask<TData, TTaskMetadata> | undefined;
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

    public dequeue(): ProcessorTask<TData, TTaskMetadata> | undefined {
        return this.queue.dequeue();
    }
}
