/**
 * A task that can be executed on a task processor.
 */
export abstract class Task<TData, TTaskMetadata> {
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
     * Creates a task.
     */
    public constructor() {
        this.index = Task.generateTaskIndex();
    }

    private static generateTaskIndex(): number {
        let result = Task.taskCounter;
        Task.taskCounter = (Task.taskCounter + 1) % (1 << 31 - 1);
        return result;
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public abstract execute(data: TData): void;

    /**
     * Gets the metadata for this task.
     */
    public abstract get metadata(): TTaskMetadata;

    /**
     * Gets a string representation for this task.
     */
    public toString(): string {
        return `Task ${this.index}`;
    }
}

/**
 * A task that uses an opaque function to do its job.
 * This type of task is suitable for initial task implementations
 * and tasks that need not be rewritten after scheduling.
 * However, this type of task is ill-suited for rewriting
 * after it is scheduled.
 */
export class OpaqueTask<TData, TTaskMetadata> extends Task<TData, TTaskMetadata> {
    private readonly executeImpl: (data: TData) => void;

    /**
     * Creates an opaque task.
     * @param execute The task's implementation.
     * @param metadata Additional information related to the task.
     */
    public constructor(
        execute: (data: TData) => void,
        public readonly metadata: TTaskMetadata) {

        super();
        this.executeImpl = execute;
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public execute(data: TData): void {
        return this.executeImpl(data);
    }
}
