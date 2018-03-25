import * as Collections from "typescript-collections";
import { TaskQueue } from "./taskQueue";
import { ModelComponent, ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";
import { Task } from "./task";
import { TaskRewriter } from "./taskRewriter";
import { PriorityPartitionedQueue } from "./priorityPartitionedQueue";
import { TaskInstruction, ModelTask } from "./taskInstruction";
import { InstructionMerger, ModelTaskRewriter } from "./instructionMerger";
import { TaskProcessor, TaskStartedCallback, TaskCompletedCallback, TaskFinishedCallback } from "./taskProcessor";

/**
 * A task queue and scheduler for model tasks.
 */
export class OutOfOrderProcessor extends TaskProcessor<ModelData, ModelTaskMetadata> {
    // This processor uses the same techniques as superscalar out-of-order processors
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

    /**
     * A set of all instructions that are eligible for immediate execution,
     * tagged by priority.
     */
    private eligibleInstructions: TaskQueue<TaskInstruction>;

    /**
     * A mapping of model components to the latest instruction that defines them.
     */
    private latestComponentStateMap: Collections.Dictionary<ModelComponent, TaskInstruction>;

    /**
     * The instruction merger used by this model task queue.
     */
    private merger: InstructionMerger;

    /**
     * The data managed by this out-of-order processor.
     */
    private state: ModelData;

    /**
     * A queue of instructions awaiting completion.
     */
    private reorderBuffer: Collections.Queue<TaskInstruction>;

    /**
     * Instructions that have finished executing to the information and their
     * task information.
     */
    private finishedInstructionMap: Collections.Dictionary<TaskInstruction, any>;

    /**
     * A set of all instructions that have been nullified.
     */
    private nullifiedInstructions: Collections.Set<TaskInstruction>;

    /**
     * Creates a out-of-order processor for model tasks.
     * @param data The data managed by the task processor.
     * @param onTaskStarted An optional callback for when a task starts.
     * @param onTaskFinished An optional callback for when a task finishes.
     * @param onTaskCompleted An optional callback for when a task completes.
     * @param instructionQueue The queue for instructions that are eligible
     * for immediate execution.
     */
    public constructor(
        data: ModelData,
        onTaskStarted?: TaskStartedCallback<ModelData, ModelTaskMetadata>,
        onTaskFinished?: TaskFinishedCallback,
        onTaskCompleted?: TaskCompletedCallback,
        instructionQueue?: TaskQueue<TaskInstruction>) {

        super(onTaskStarted, onTaskFinished, onTaskCompleted);

        this.state = data;

        if (instructionQueue) {
            this.eligibleInstructions = instructionQueue;
        } else {
            this.eligibleInstructions = new PriorityPartitionedQueue<TaskInstruction>(
                TaskInstruction.getPriority);
        }

        this.latestComponentStateMap = new Collections.Dictionary<ModelComponent, TaskInstruction>();
        this.merger = new InstructionMerger();
        this.reorderBuffer = new Collections.Queue<TaskInstruction>();
        this.finishedInstructionMap = new Collections.Dictionary<TaskInstruction, any>();
        this.nullifiedInstructions = new Collections.Set<TaskInstruction>();
    }

    /**
     * Tells if the schedule for this processor is empty.
     */
    public isEmpty(): boolean {
        return this.eligibleInstructions.size() - this.nullifiedInstructions.size() === 0;
    }

    /**
     * Schedules a task for execution.
     * @param task The task to schedule.
     */
    public schedule(task: Task<ModelData, ModelTaskMetadata>): void {
        // Create a new instruction.
        let instruction = new TaskInstruction(task, this.state.clone());

        // Turn the instruction's read set into a dependency set.
        task.metadata.readSet.forEach(component => {
            let dependency = this.latestComponentStateMap.getValue(component);
            if (dependency) {
                if (this.finishedInstructionMap.containsKey(dependency)) {
                    // Finished instructions don't become dependencies. Instead,
                    // copy their output to the new instruction's captured data.
                    instruction.data.setComponent<any>(
                        ModelComponent.DataGraph,
                        dependency.data.getComponent<any>(ModelComponent.DataGraph));
                } else {
                    instruction.addDependency(dependency, component);
                }
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

        // Add the instruction to the reorder buffer.
        this.reorderBuffer.enqueue(instruction);
    }

    /**
     * Deschedules a task and executes it. Does nothing if
     * the task schedule is empty.
     * @returns `true` if a task was processed;
     * otherwise, `false`.
     */
    public processTask(): boolean {
        // Pick the first eligible instruction that has not been
        // nullified (yet).
        let instr = this.dequeueInstruction();

        // Task queue is empty. Do nothing.
        if (instr === undefined) {
            return false;
        }

        // Start executing the task.
        let info = this.onTaskStarted(instr.task);

        // Execute the task on the data.
        instr.task.execute(instr.data);

        // Finish executing the task.
        this.finish(instr);
        info = this.onTaskFinished(info);

        // Add the finished instruction to the finished
        // instruction map.
        this.finishedInstructionMap.setValue(instr, info);

        // Try to complete as many instructions as possible.
        this.completeInstructions();

        return true;
    }

    /**
     * Registers a new rewriter with this task queue.
     * @param rewriter The rewriter to register.
     */
    public registerRewriter(rewriter: ModelTaskRewriter): void {
        this.merger.registerRewriter(rewriter);
    }

    /**
     * Dequeues an instruction from the eligible instruction queue.
     */
    private dequeueInstruction(): TaskInstruction | undefined {
        // Pick the first eligible instruction that has not been
        // nullified (yet).
        let instr: TaskInstruction | undefined;
        let isNullified: boolean;
        while (true) {
            instr = this.eligibleInstructions.dequeue();

            // Task queue is empty. Return undefined.
            if (instr === undefined) {
                return undefined;
            }

            // Check if the instruction has been nullified.
            isNullified = this.nullifiedInstructions.contains(instr);
            if (isNullified) {
                // Drop the nullified instruction by proceeding to the next iteration.
                this.nullifiedInstructions.remove(instr);
            } else {
                // We found a non-nullified instruction. Great!
                break;
            }
        }

        // Iteratively merge the instruction with other instructions.
        let nullifiedInstr: TaskInstruction | undefined;
        do {
            nullifiedInstr = this.merger.merge(instr);
            if (nullifiedInstr !== undefined) {
                if (nullifiedInstr === instr) {
                    // Ignore this instruction and process another task.
                    return this.dequeueInstruction();
                } else if (nullifiedInstr.isEligibleForExecution) {
                    // Nullify the other instruction and try to keep on
                    // merging instructions.
                    //
                    // Only do this if the nullified instruction is eligible
                    // for instruction. If so, then it will already be in the
                    // eligible instruction queue.
                    //
                    // Nullifying instructions that are not yet in the
                    // eligible instruction queue will cause a memory leak:
                    // the nullified instruction gets added to the set of
                    // nullified instructions but is never removed from that
                    // set because it will never enter (or leave) the eligible
                    // instruction queue.
                    this.nullifiedInstructions.add(nullifiedInstr);
                }
            }
        } while (nullifiedInstr !== undefined);

        return instr;
    }

    /**
     * Completes as many instructions as possible.
     */
    private completeInstructions(): void {
        while (true) {
            let instruction = this.reorderBuffer.peek();
            if (instruction === undefined) {
                break;
            }

            let info = this.finishedInstructionMap.getValue(instruction);
            if (info !== undefined) {
                // Remove the instruction from the reorder buffer.
                instruction = this.reorderBuffer.dequeue()!;

                // Remove the instruction from the finished instruction map.
                this.finishedInstructionMap.remove(instruction);

                // Complete the instruction.
                this.complete(instruction);

                // Signal the instruction-completed handler.
                this.onTaskCompleted(info);
            } else {
                break;
            }
        }
    }

    /**
     * Completes an instruction.
     * @param instruction The instruction to complete.
     * @param instructionData The model data for the instruction.
     */
    private complete(instruction: TaskInstruction): void {
        instruction.task.metadata.writeSet.forEach(component => {
            // Update the state map if applicable.
            if (this.latestComponentStateMap.getValue(component) === instruction) {
                this.latestComponentStateMap.remove(component);
            }

            // Update the architecture state.
            this.state.setComponent<any>(
                component,
                instruction.data.getComponent<any>(component));
        });
    }

    /**
     * Finishes executing an instruction.
     * @param instruction The instruction to finish executing.
     */
    private finish(instruction: TaskInstruction): void {
        // Remove the instruction from consideration for merging.
        this.merger.finishInstruction(instruction);

        // Remove the instruction from the dependency set of
        // all other instructions.
        instruction.invertedDependencies.forEach(dependentInstruction => {
            // Update the captured state of the dependent instruction.
            instruction.transferOutput(dependentInstruction);

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
    }
}
