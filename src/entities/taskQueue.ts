/**
 * A queue of tasks for task processors. Implementations
 * of this interface need not adhere to a FIFO scheduling policy.
 */
export interface TaskQueue<T> {
    /**
     * Tells if the task queue is empty.
     */
    isEmpty(): boolean;

    /**
     * Adds a task to the queue.
     * @param task The task to add.
     */
    enqueue(task: T): void;

    /**
     * Removes a task from the queue and returns it.
     */
    dequeue(): T | undefined;
}
