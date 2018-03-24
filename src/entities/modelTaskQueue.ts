import * as Collections from "typescript-collections";
import { TaskQueue } from "./taskProcessor";
import { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";
import { Task } from "./task";
import { TaskRewriter } from "./taskRewriter";
import { PriorityPartitionedQueue } from "./priorityPartitionedQueue";
import { TaskInstruction, ModelTask } from "./taskInstruction";
import { InstructionMerger, ModelTaskRewriter } from "./instructionMerger";

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

        // Introduce the instruction to the instruction merger.
        this.merger.introduceInstruction(instruction);
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
     * Registers a new rewriter with this task queue.
     * @param rewriter The rewriter to register.
     */
    public registerRewriter(rewriter: ModelTaskRewriter): void {
        this.merger.registerRewriter(rewriter);
    }

    /**
     * Completes an instruction.
     * @param instruction The instruction to complete.
     */
    private complete(instruction: TaskInstruction): void {
        // Remove the instruction from consideration for merging.
        this.merger.completeInstruction(instruction);

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
}
