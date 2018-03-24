import * as Collections from "typescript-collections";
import { Task } from "./task";

type TaskStartedCallback<TData, TTaskMetadata> =
    (task: Task<TData, TTaskMetadata>) => any;

type TaskCompletedCallback =
    (taskInfo: any) => void;

/**
 * An object that executes tasks on a piece of data.
 */
export abstract class TaskProcessor<TData, TTaskMetadata> {
    protected readonly onTaskStarted: TaskStartedCallback<TData, TTaskMetadata>;
    protected readonly onTaskCompleted: TaskCompletedCallback;

    /**
     * Creates a task processor.
     * @param onTaskStarted An optional callback for when a task starts.
     * @param onTaskCompleted An optional callback for when a task completes.
     */
    public constructor(
        onTaskStarted?: TaskStartedCallback<TData, TTaskMetadata>,
        onTaskCompleted?: TaskCompletedCallback) {

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
     * Tells if the model's task schedule is empty.
     */
    public abstract get isScheduleEmpty(): boolean;

    /**
     * Schedules a task for execution by this processor.
     */
    public abstract schedule(task: Task<TData, TTaskMetadata>): void;

    /**
     * Deschedules a task and executes it. Does nothing if
     * the task schedule is empty.
     */
    public abstract processTask(): void;

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
}

/**
 * A task processor implementation that executes tasks in the order they
 * were scheduled.
 */
export class InOrderProcessor<TData, TTaskMetadata> extends TaskProcessor<TData, TTaskMetadata> {
    private tasks: TaskQueue<TData, TTaskMetadata>;
    private data: TData;

    /**
     * Creates a task processor that manages a particular piece of data
     * and uses a particular task queue.
     * @param data The data managed by the task processor.
     * @param tasks The queue implementation for this processor.
     * @param onTaskStarted An optional callback for when a task starts.
     * @param onTaskCompleted An optional callback for when a task completes.
     */
    public constructor(
        data: TData,
        tasks?: TaskQueue<TData, TTaskMetadata>,
        onTaskStarted?: TaskStartedCallback<TData, TTaskMetadata>,
        onTaskCompleted?: TaskCompletedCallback) {

        super(onTaskStarted, onTaskCompleted);

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
    public schedule(task: Task<TData, TTaskMetadata>): void {
        this.tasks.enqueue(task);
    }

    /**
     * Tells if the model's task schedule is empty.
     */
    public get isScheduleEmpty(): boolean {
        return this.tasks.isEmpty;
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
    enqueue(task: Task<TData, TTaskMetadata>): void;

    /**
     * Removes a task from the queue and returns it.
     */
    dequeue(): Task<TData, TTaskMetadata> | undefined;
}

/**
 * A task queue that executes tasks in FIFO order.
 */
export class FifoTaskQueue<TData, TTaskMetadata> implements TaskQueue<TData, TTaskMetadata> {
    private queue: Collections.Queue<Task<TData, TTaskMetadata>>;

    public constructor() {
        this.queue = new Collections.Queue<Task<TData, TTaskMetadata>>();
    }

    public get isEmpty(): boolean {
        return this.queue.isEmpty();
    }

    public enqueue(task: Task<TData, TTaskMetadata>): void {
        this.queue.enqueue(task);
    }

    public dequeue(): Task<TData, TTaskMetadata> | undefined {
        return this.queue.dequeue();
    }
}
