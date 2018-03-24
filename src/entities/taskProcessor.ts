import * as Collections from "typescript-collections";
import { Task } from "./task";
import { TaskQueue } from "./taskQueue";

export type TaskStartedCallback<TData, TTaskMetadata> =
    (task: Task<TData, TTaskMetadata>) => any;

export type TaskCompletedCallback =
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
            this.onTaskStarted = (task) => null;
        }
        if (onTaskCompleted) {
            this.onTaskCompleted = onTaskCompleted;
        } else {
            this.onTaskCompleted = (info) => undefined;
        }
    }

    /**
     * Tells if the processor's task schedule is empty.
     */
    public abstract isEmpty(): boolean;

    /**
     * Schedules a task for execution by this processor.
     * @param task The task to schedule.
     */
    public abstract schedule(task: Task<TData, TTaskMetadata>): void;

    /**
     * Deschedules a task and executes it. Does nothing if
     * the task schedule is empty.
     * @returns `true` if a task was processed;
     * otherwise, `false`.
     */
    public abstract processTask(): boolean;

    /**
     * Deschedules and executes tasks until the task schedule
     * becomes empty..
     */
    public processAllTasks(): void {
        while (!this.isEmpty()) {
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
        while (!this.isEmpty() && current - start < milliseconds) {
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
    private tasks: Collections.Queue<Task<TData, TTaskMetadata>>;
    private data: TData;

    /**
     * Creates a task processor that manages a particular piece of data.
     * @param data The data managed by the task processor.
     * @param onTaskStarted An optional callback for when a task starts.
     * @param onTaskCompleted An optional callback for when a task completes.
     */
    public constructor(
        data: TData,
        onTaskStarted?: TaskStartedCallback<TData, TTaskMetadata>,
        onTaskCompleted?: TaskCompletedCallback) {

        super(onTaskStarted, onTaskCompleted);

        this.data = data;
        this.tasks = new Collections.Queue<Task<TData, TTaskMetadata>>();
    }

    /**
     * Schedules a task for execution by this processor.
     */
    public schedule(task: Task<TData, TTaskMetadata>): void {
        this.tasks.enqueue(task);
    }

    /**
     * Tells if the processor's task schedule is empty.
     */
    public isEmpty(): boolean {
        return this.tasks.isEmpty();
    }

    /**
     * Deschedules a task and executes it. Does nothing if
     * the task schedule is empty.
     * @returns `true` if a task was processed;
     * otherwise, `false`.
     */
    public processTask(): boolean {
        let task = this.tasks.dequeue();
        if (task === undefined) {
            return false;
        }
        let info = this.onTaskStarted(task);
        task.execute(this.data);
        this.onTaskCompleted(info);
        return true;
    }
}
