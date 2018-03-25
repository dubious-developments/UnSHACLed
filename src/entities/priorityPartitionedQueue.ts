import * as Collections from "typescript-collections";
import { TaskQueue } from "./taskQueue";

/**
 * A sequence of queues that are combined in a single queue-like
 * data structure. Each sub-queue is tagged with its own priority
 * and higher-priority queues are preferred over low-priority queues
 * when dequeuing elements.
 */
export class PriorityPartitionedQueue<T> implements TaskQueue<T> {
    /**
     * The sub-queues in this priority-partitioned queue. Each subqueue
     * is indexed by its priority.
     */
    private subQueues: Collections.DefaultDictionary<number, Collections.Queue<T>>;

    /**
     * The total number of elements in the sub-queues.
     */
    private count: number;

    /**
     * A generator that chooses which sub-queue is serviced.
     */
    private priorityGen: PriorityGenerator;

    /**
     * Creates a priority-partitioned queue.
     * @param getPriority A function that computes the priority of a value.
     */
    public constructor(
        public readonly getPriority: (value: T) => number) {

        this.count = 0;
        this.subQueues = new Collections.DefaultDictionary<number, Collections.Queue<T>>(
            () => new Collections.Queue<T>());
        this.priorityGen = new PriorityGenerator();
    }

    /**
     * Gets the number of tasks in the queue.
     */
    public size(): number {
        return this.count;
    }

    /**
     * Tests if this priority-partitioned queue is empty.
     */
    public isEmpty(): boolean {
        return this.count === 0;
    }

    /**
     * Adds a value to this priority-partitioned queue.
     */
    public enqueue(value: T): void {
        let priority = this.getPriority(value);
        let subQueue = this.subQueues.getValue(priority);
        if (subQueue.isEmpty()) {
            this.priorityGen.notifyPriorityExists(priority);
        }
        subQueue.enqueue(value);
        this.count++;
        this.subQueues.setValue(priority, subQueue);
    }

    /**
     * Dequeues an element from this priority-partitioned queue.
     */
    public dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        // Pick the next non-empty sub-queue.
        let subQueue: Collections.Queue<T>;
        do {
            let priority = this.priorityGen.next();
            subQueue = this.subQueues.getValue(priority);
        } while (subQueue.isEmpty());

        // Dequeue an element from the sub-queue.
        let result = subQueue.dequeue();
        this.count--;

        return result;
    }
}

/**
 * Generates priorities based on a max priority and a min priority.
 * Higher priorities are picked more often.
 */
export class PriorityGenerator {
    // This class generates priorities by setting a frontier value,
    // iterating from the highest priority all the way to that
    // frontier and then decrementing the frontier. This process
    // repeats until the frontier reaches the lowest priority, at
    // which point the frontier is reset to the highest priority and
    // the generator starts all over again.
    //
    // For example, suppose that the lowest priority is -2 and the
    // highest priority is 3. Then the priority generator produces
    // a sequence of priorities like so:
    //
    // Initial state (caret denotes next value, bar denotes frontier)
    //
    //     3  2  1  0 -1 -2
    //     ^|
    //
    // After first `next()`:
    //
    //     3  2  1  0 -1 -2
    //     ^   |
    //
    // After second `next()`:
    //
    //     3  2  1  0 -1 -2
    //        ^|
    //
    // ...
    //
    // The generated sequence would be
    //
    //     [3,
    //      3, 2,
    //      3, 2, 1,
    //      3, 2, 1, 0,
    //      3, 2, 1, 0, -1,
    //      3, 2, 1, 0, -1, -2].
    //
    // Clearly, the highest priority is generated the most. But the
    // lowest priority is not entirely neglected. More precisely, the
    // number of times that the ith priority is chosen per cycle
    // is `i - min + 1`.
    //
    // Consequently, the length of a cycle is
    //
    //     sum_{i = min}^{max} (i - min + 1)
    //     = sum_{i = 1}^{max - min + 1} i
    //     = (max - min + 1) * (max - min + 2) / 2.
    //
    // Hence, the relative number of times that the ith priority is
    // chosen by this generator is
    //
    //             2 * (i - min + 1)
    //     --------------------------------- .
    //     (max - min + 1) * (max - min + 2)

    /**
     * The lowest priority.
     */
    private min: number;

    /**
     * The highest priority.
     */
    private max: number;

    /**
     * The next priority to return.
     */
    private current: number;

    /**
     * The priority at which the generator returns to the highest
     * priority.
     */
    private frontier: number;

    /**
     * Creates a priority generator.
     */
    public constructor() {
        this.min = 0;
        this.max = 0;
        this.current = 0;
        this.frontier = 0;
    }

    /**
     * Notifies the priority generator that a particular priority exists.
     * @param priority A priority that will be included in the priorities
     * generated by this generator.
     */
    public notifyPriorityExists(priority: number): void {
        this.min = Math.min(this.min, priority);

        let oldMax = this.max;
        this.max = Math.max(this.max, priority);
        if (oldMax !== this.max) {
            this.current = this.max;
            this.frontier = this.max;
        }
    }

    /**
     * Generates the next priority.
     */
    public next(): number {
        let result = this.current;
        if (result <= this.frontier) {
            this.nextFrontier();
        } else {
            this.current--;
        }
        return result;
    }

    /**
     * Advances the frontier and sets the next priority to the
     * max element.
     */
    private nextFrontier(): void {
        if (this.frontier > this.min) {
            this.frontier--;
        } else {
            this.frontier = this.max;
        }
        this.current = this.max;
    }
}
