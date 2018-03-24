import * as Collections from "typescript-collections";
import { TaskQueue } from "./taskProcessor";
import { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";
import { Task } from "./task";
import { TaskRewriter } from "./taskRewriter";
import { PriorityPartitionedQueue } from "./priorityPartitionedQueue";

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

    private static hasEmptyIntersection<T>(
        first: Collections.Set<T>,
        second: Collections.Set<T>): boolean {

        let hasEmptyIntersection = true;
        first.forEach(element => {
            if (second.contains(element)) {
                hasEmptyIntersection = false;
            }
        });
        return hasEmptyIntersection;
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

    /**
     * Tries to merge a particular instruction once.
     * @param instruction The instruction to merge with other instructions.
     */
    public merge(instruction: TaskInstruction):
        { merged: TaskInstruction, nullified: TaskInstruction } | undefined {

        // This function needs to be fast, so we can't compare every pair
        // of instructions. Instead, we'll make some simplifications.
        //
        //   * We will only consider merging two tasks at a time.
        //
        //   * We will only consider tasks if they have a read-after-write
        //     or write-after-write dependency. (Considering every pair
        //     of instructions is costly.)

        let rawCandidates = this.findReadAfterWriteMergeCandidates(instruction);

        for (let rawCandidate of rawCandidates) {
            let mergedTask = rawCandidate.rewriter.maybeRewrite(
                instruction.task,
                rawCandidate.candidate.task);

            if (mergedTask) {
                // Found a match. Complete the merge.
                return {
                    merged: this.createMergedInstruction(
                        instruction,
                        rawCandidate.candidate,
                        mergedTask),
                    nullified: rawCandidate.candidate
                };
            }
        }

        // TODO: consider write-after-write dependencies.

        // Found nothing of interest.
        return undefined;
    }

    /**
     * Merges two instructions together.
     * @param first The first instruction to merge.
     * @param second The second instruction to merge.
     * @param mergedTask The merged task.
     */
    private createMergedInstruction(
        first: TaskInstruction,
        second: TaskInstruction,
        mergedTask: ModelTask): TaskInstruction {

        let mergedInstr = new TaskInstruction(mergedTask);

        // Transfer dependencies from old instructions to
        // the merged instruction.
        let transferDependencies = originalInstr => {
            originalInstr.invertedDependencies.forEach(element => {
                element.dependencies.remove(originalInstr);
                element.dependencies.add(mergedInstr);
                mergedInstr.invertedDependencies.add(element);
            });
        };

        transferDependencies(first);
        transferDependencies(second);

        // Remove the old instructions from consideration.
        this.completeInstruction(first);
        this.completeInstruction(second);

        // Add the merged instruction to the instruction
        // window.
        this.introduceInstruction(mergedInstr);

        return mergedInstr;
    }

    /**
     * Tries to find all read-after-write dependencies that can
     * be merged with a particular instruction, along with the
     * rewriters that would merge them.
     * @param instruction The instruction to find merge candidates for.
     */
    private findReadAfterWriteMergeCandidates(instruction: TaskInstruction):
        { candidate: TaskInstruction, rewriter: ModelTaskRewriter }[] {

        let results = [];

        // Look for read-after-write dependencies that can be merged in.
        instruction.invertedDependencies.forEach(otherInstruction => {

            for (let i = 0; i < this.rewriters.length; i++) {

                let interestSet = this.interestSets[i];

                if (interestSet.contains(otherInstruction)
                    && interestSet.contains(instruction)
                    && this.canMergeReadAfterWrite(instruction, otherInstruction)) {

                    results.push({ candidate: otherInstruction, rewriter: this.rewriters[i] });
                }
            }
        });

        return results;
    }

    /**
     * Tells if two instruction with a read-after-write dependency
     * between them can safely be merged.
     *
     * @param first The first instruction to merge, which writes to
     * a component from which the second instruction reads.
     *
     * @param second The second instruction to merge, which reads
     * from a component to which the first instruction writes.
     */
    private canMergeReadAfterWrite(first: TaskInstruction, second: TaskInstruction): boolean {
        // The 'taskRewriter' file contains a more comprehensive
        // discussion of preconditions for tasks to be mergeable,
        // but the gist of it is that
        //
        //   1. The dependencies of the merged task are the union of its
        //      component tasks' dependencies.
        //
        //   2. There is no task that depends on a write of the merged
        //      task but not on all component tasks that write to that
        //      component.
        //
        //   3. Tasks cannot be merged if there exists some task T
        //      such that T is dependent on one task to merge and
        //      another task to merge is dependent on T.

        let canMerge = true;

        first.invertedDependencies.forEach(dependentInstr => {
            if (dependentInstr === second) {
                return;
            }

            // Check second condition: we need to make sure that there is
            // no instruction that reads from a value to which the second
            // instruction writes.
            //
            // Also check third condition: make sure that the second
            // instruction does not depend on one of the first instruction's
            // dependent instructions.
            if (!InstructionMerger.hasEmptyIntersection(
                dependentInstr.task.metadata.readSet,
                second.task.metadata.writeSet)
                || second.dependencies.contains(dependentInstr)) {

                canMerge = false;
            }
        });

        return canMerge;
    }
}
