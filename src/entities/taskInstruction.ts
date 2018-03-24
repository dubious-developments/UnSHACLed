import * as Collections from "typescript-collections";
import { Task } from "./task";
import { ModelTaskMetadata } from "./modelTaskMetadata";
import { ModelData } from "./modelData";

/**
 * The type of task used by the model.
 */
export type ModelTask = Task<ModelData, ModelTaskMetadata>;

/**
 * A task represented as an instruction in SSA form.
 */
export class TaskInstruction {
    /**
     * The task that is stored in this instruction.
     */
    public readonly task: ModelTask;

    /**
     * The model data captured by this instruction.
     */
    public data: ModelData;

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
     * @param data The captured data for this instruction.
     */
    public constructor(task: ModelTask, data: ModelData) {
        this.task = task;
        this.data = data;
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
     * Transfers the this instruction to a dependent instruction.
     * @param target The instruction to which data is copied.
     */
    public transferOutput(target: TaskInstruction): void {
        this.task.metadata.writeSet.forEach(component => {
            if (target.task.metadata.readSet.contains(component)) {
                target.data.setComponent<any>(
                    component,
                    this.data.getComponent<any>(component));
            }
        });
    }

    /**
     * Gets a string representation for this instruction.
     */
    public toString(): string {
        return `Instruction ${this.task.index}`;
    }
}
