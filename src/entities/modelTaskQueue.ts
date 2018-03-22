import * as Collections from "typescript-collections";
import { TaskProcessor, ProcessorTask, TaskQueue } from "./taskProcessor";
import { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";
import { ICompareFunction, defaultCompare } from "typescript-collections/dist/lib/util";

/**
 * A task queue and scheduler for model tasks.
 */
export class ModelTaskQueue implements TaskQueue<ModelData, ModelTaskMetadata> {
    // This task queue uses the same techniques as superscalar out-of-order processors
    // and state-of-the-art compilers such as LLVM and GCC to reason about instructions.
    //
    // Specifically, each task is represented as an instruction in single static
    // assignment (SSA) form.

    /**
     * A set of all instructions that are eligible for immediate execution,
     * tagged by priority.
     */
    private eligibleInstructions: Collections.PriorityQueue<TaskInstruction>;

    /**
     * A mapping of model components to the latest instruction that defines them.
     */
    private latestComponentStateMap: Collections.Dictionary<ModelComponent, TaskInstruction>;

    /**
     * Creates a new model task queue.
     */
    public constructor() {
        this.eligibleInstructions = new Collections.PriorityQueue<TaskInstruction>(
            TaskInstruction.compare);
        this.latestComponentStateMap = new Collections.Dictionary<ModelComponent, TaskInstruction>();
    }

    public enqueue(task: ProcessorTask<ModelData, ModelTaskMetadata>): void {
        throw new Error("Method not implemented.");
    }

    public get isEmpty(): boolean {
        return this.eligibleInstructions.isEmpty();
    }

    public dequeue(): ProcessorTask<ModelData, ModelTaskMetadata> {
        // Pick the eligible instruction with the highest priority.
        let instr = this.eligibleInstructions.dequeue();
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
                this.eligibleInstructions.add(dependentInstruction);
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
}

/**
 * A task represented as an instruction in SSA form.
 */
class TaskInstruction {
    /**
     * The task that is stored in this instruction.
     */
    public readonly task: ProcessorTask<ModelData, ModelTaskMetadata>;

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
    public constructor(task: ProcessorTask<ModelData, ModelTaskMetadata>) {
        this.task = task;
        this.dependencies = new Collections.Set<TaskInstruction>();
        this.invertedDependencies = new Collections.Set<TaskInstruction>();
    }

    /**
     * Compares the priority of two task instructions.
     * @param a A first task instruction.
     * @param b A second task instruction.
     */
    public static compare(a: TaskInstruction, b: TaskInstruction): number {
        return defaultCompare<number>(a.task.metadata.priority, b.task.metadata.priority);
    }

    /**
     * Tests if this instruction is eligible for execution.
     */
    public get isEligibleForExecution(): boolean {
        return this.dependencies.isEmpty();
    }
}
