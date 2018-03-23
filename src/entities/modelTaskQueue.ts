import * as Collections from "typescript-collections";
import { TaskQueue } from "./taskProcessor";
import { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";
import { Task } from "./task";
import { TaskRewriter } from "./taskRewriter";

/**
 * The type of task used by the model.
 */
export type ModelTask = Task<ModelData, ModelTaskMetadata>;

/**
 * The type of task rewriters used by the model.
 */
export type ModelTaskRewriter = TaskRewriter<ModelData, ModelTaskMetadata>;

/**
 * A task queue and scheduler for model tasks.
 */
export class ModelTaskQueue implements TaskQueue<ModelData, ModelTaskMetadata> {
    // This task queue uses the same techniques as superscalar out-of-order processors
    // and state-of-the-art compilers such as LLVM and GCC to reason about instructions.
    //
    // Specifically, each task is represented as an instruction in a mutable
    // variant of single static assignment (SSA) form. When an instruction is executed,
    // that instruction is removed as a dependency from all dependent instructions.
    // Instructions become eligible for execution when their dependency set becomes empty,
    // i.e., all of their dependencies have been executed.
    //
    // This scheme is used in superscalar out-of-order processors to run multiple tasks
    // at the same time. It is used here to prioritize tasks---data flow execution allows
    // us to cherry-pick high-priority from the task queue, dependencies permitting.
    //
    // Operations in the model task queue are never worse than `O(n)`, where `n` is the
    // number of tasks in the queue. For typical workloads, the complexity of enqueuing
    // and dequeuing a task should be much lower than that.

    /**
     * A set of all instructions that are eligible for immediate execution,
     * tagged by priority.
     */
    private eligibleInstructions: PriorityPartitionedQueue<TaskInstruction>;

    /**
     * A mapping of model components to the latest instruction that defines them.
     */
    private latestComponentStateMap: Collections.Dictionary<ModelComponent, TaskInstruction>;

    /**
     * Gets the instruction merger used by this model task queue.
     */
    private merger: InstructionMerger;

    /**
     * Creates a new model task queue.
     */
    public constructor() {
        this.eligibleInstructions = new PriorityPartitionedQueue<TaskInstruction>(
            TaskInstruction.getPriority);
        this.latestComponentStateMap = new Collections.Dictionary<ModelComponent, TaskInstruction>();
        this.merger = new InstructionMerger();
    }

    /**
     * Tells if the task queue is empty.
     */
    public get isEmpty(): boolean {
        return this.eligibleInstructions.isEmpty;
    }

    /**
     * Adds a task to the queue.
     * @param task The task to add.
     */
    public enqueue(task: ModelTask): void {

        // Create a new instruction.
        let instruction = new TaskInstruction(task);

        // Turn the instruction's read set into a dependency set.
        task.metadata.readSet.forEach(component => {
            let dependency = this.latestComponentStateMap.getValue(component);
            if (dependency) {
                instruction.dependencies.add(dependency);
                dependency.invertedDependencies.add(instruction);
            }
        });

        // Use the instruction's write set to update the latest component state map.
        task.metadata.writeSet.forEach(component => {
            this.latestComponentStateMap.setValue(component, instruction);
        });

        // Mark the instruction as eligible for instruction if all of its
        // dependencies have already been computed.
        if (instruction.isEligibleForExecution) {
            this.eligibleInstructions.enqueue(instruction);
        }
    }

    /**
     * Removes a task from the queue and returns it.
     */
    public dequeue(): ModelTask | undefined {
        // Pick the eligible instruction with the highest priority.
        let instr = this.eligibleInstructions.dequeue();
        if (instr === undefined) {
            return undefined;
        }
        // Complete that instruction (pre-emptively).
        this.complete(instr);
        // Return the task associated with the instruction.
        return instr.task;
    }

    /**
     * Completes an instruction.
     * @param instruction The instruction to complete.
     */
    private complete(instruction: TaskInstruction): void {
        // Remove the instruction from the dependency set of
        // all other instructions.
        instruction.invertedDependencies.forEach(dependentInstruction => {
            dependentInstruction.dependencies.remove(instruction);

            // Add instructions that become eligible for execution
            // to the set of eligible instructions.
            if (dependentInstruction.isEligibleForExecution) {
                this.eligibleInstructions.enqueue(dependentInstruction);
            }
        });

        // Clear the instruction's inverted dependencies because
        // they are no longer valid.
        instruction.invertedDependencies.clear();

        // Update the state map if applicable.
        instruction.task.metadata.writeSet.forEach(component => {
            if (this.latestComponentStateMap.getValue(component) === instruction) {
                this.latestComponentStateMap.remove(component);
            }
        });
    }

    /**
     * Registers a new rewriter with this task queue.
     * @param rewriter The rewriter to register.
     */
    public registerRewriter(rewriter: ModelTaskRewriter): void {
        this.merger.registerRewriter(rewriter);
    }
}

/**
 * A task represented as an instruction in SSA form.
 */
class TaskInstruction {
    /**
     * The task that is stored in this instruction.
     */
    public readonly task: ModelTask;

    /**
     * The set of instructions that must complete before the task
     * represented by this instruction can be executed.
     */
    public dependencies: Collections.Set<TaskInstruction>;

    /**
     * The set of instructions that have a dependency on this instruction.
     */
    public invertedDependencies: Collections.Set<TaskInstruction>;

    /**
     * Creates a task instruction.
     * @param task The task that is stored in this instruction.
     */
    public constructor(task: ModelTask) {
        this.task = task;
        this.dependencies = new Collections.Set<TaskInstruction>();
        this.invertedDependencies = new Collections.Set<TaskInstruction>();
    }

    /**
     * Get the priority of a task instruction.
     * @param instruction A task instruction to examine.
     * @returns The priority associated with the task instruction.
     */
    public static getPriority(instruction: TaskInstruction): number {
        return instruction.task.metadata.priority;
    }

    /**
     * Tests if this instruction is eligible for execution.
     */
    public get isEligibleForExecution(): boolean {
        return this.dependencies.isEmpty();
    }

    /**
     * Gets a string representation for this instruction.
     */
    public toString(): string {
        return `Instruction ${this.task.index}`;
    }
}

/**
 * A sequence of queues that are combined in a single queue-like
 * data structure. Each sub-queue is tagged with its own priority
 * and higher-priority queues are preferred over low-priority queues
 * when dequeuing elements.
 */
class PriorityPartitionedQueue<T> {
    /**
     * The sub-queues in this priority-partitioned queue. Each subqueue
     * is indexed by its priority.
     */
    private subQueues: Collections.DefaultDictionary<number, Collections.Queue<T>>;

    /**
     * The number of non-empty sub-queues.
     */
    private nonEmptySubQueueCount: number;

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
        this.nonEmptySubQueueCount = 0;
        this.subQueues = new Collections.DefaultDictionary<number, Collections.Queue<T>>(
            () => new Collections.Queue<T>());
        this.priorityGen = new PriorityGenerator();
    }

    /**
     * Tests if this priority-partitioned queue is empty.
     */
    public get isEmpty(): boolean {
        return this.nonEmptySubQueueCount === 0;
    }

    /**
     * Adds a value to this priority-partitioned queue.
     */
    public enqueue(value: T): void {
        let priority = this.getPriority(value);
        let subQueue = this.subQueues.getValue(priority);
        if (subQueue.isEmpty()) {
            this.nonEmptySubQueueCount++;
            this.priorityGen.notifyPriorityExists(priority);
        }
        subQueue.enqueue(value);
        this.subQueues.setValue(priority, subQueue);
    }

    /**
     * Dequeues an element from this priority-partitioned queue.
     */
    public dequeue(): T | undefined {
        if (this.isEmpty) {
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

        if (subQueue.isEmpty()) {
            this.nonEmptySubQueueCount--;
        }

        return result;
    }
}

/**
 * Merges instructions.
 */
class InstructionMerger {
    /**
     * A list of all rewriters that are registered with this instruction
     * merger.
     */
    private rewriters: ModelTaskRewriter[];

    /**
     * An array of sets containing all instruction that are of interest
     * to a rewriter. These sets are indexed in the same way as the
     * rewriters array.
     */
    private interestSets: Collections.Set<TaskInstruction>[];

    /**
     * Creates an empty instruction merger.
     */
    public constructor() {
        this.rewriters = [];
        this.interestSets = [];
    }

    /**
     * Registers a task rewriter with this instruction merger.
     * @param rewriter The rewriter to use.
     */
    public registerRewriter(rewriter: ModelTaskRewriter): void {
        this.rewriters.push(rewriter);
        this.interestSets.push(new Collections.Set<TaskInstruction>());
    }

    /**
     * Introduces an instruction to this instruction merger.
     * @param instruction The instruction to introduce.
     */
    public introduceInstruction(instruction: TaskInstruction): void {
        for (let i = 0; i < this.rewriters.length; i++) {
            if (this.rewriters[i].isOfInterest(instruction.task)) {
                this.interestSets[i].add(instruction);
            }
        }
    }

    /**
     * Completes an instruction, removing it from consideration
     * for instruction merging.
     * @param instruction The instruction to complete.
     */
    public completeInstruction(instruction: TaskInstruction): void {
        for (let i = 0; i < this.interestSets.length; i++) {
            this.interestSets[i].remove(instruction);
        }
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
