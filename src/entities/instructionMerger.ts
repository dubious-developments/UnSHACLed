import * as Collections from "typescript-collections";
import { TaskInstruction, ModelTask } from "./taskInstruction";
import { TaskRewriter } from "./taskRewriter";
import { ModelData } from "./modelData";
import { ModelTaskMetadata } from "./modelTaskMetadata";

/**
 * The type of task rewriter used by the model.
 */
export type ModelTaskRewriter = TaskRewriter<ModelData, ModelTaskMetadata>;

/**
 * Merges instructions.
 */
export class InstructionMerger {
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
     * Finishes an instruction, removing it from consideration
     * for instruction merging.
     * @param instruction The instruction to complete.
     */
    public finishInstruction(instruction: TaskInstruction): void {
        for (let i = 0; i < this.interestSets.length; i++) {
            this.interestSets[i].remove(instruction);
        }
    }

    /**
     * Tries to merge a particular instruction once.
     * @param instruction The instruction to merge with other instructions.
     * This instruction must be eligible for immediate execution.
     * @returns A merged instruction and a nullified instruction if the
     * instruction was merged with some other instruction; otherwise,
     * `undefined`.
     */
    public merge(instruction: TaskInstruction): { merged: TaskInstruction, nullified: TaskInstruction } | undefined {

        // This function needs to be fast, so we can't compare every pair
        // of instructions. Instead, we'll make some simplifications.
        //
        //   * We will only consider merging two tasks at a time.
        //
        //   * We will only consider tasks if they have a read-after-write
        //     dependence.

        let rawCandidates = this.findReadAfterWriteMergeCandidates(instruction);

        for (let rawCandidate of rawCandidates) {
            let mergedTask = rawCandidate.rewriter.maybeConcat(
                instruction.task,
                rawCandidate.candidate.task);

            if (mergedTask) {
                // Found a match. Complete the merge.
                this.concatInstructions(instruction, rawCandidate.candidate, mergedTask);
                return {
                    merged: instruction,
                    nullified: rawCandidate.candidate
                };
            }
        }

        // Found nothing of interest.
        return undefined;
    }

    /**
     * Merges two instructions together.
     * @param first The first instruction to merge.
     * @param second The second instruction to merge.
     * @param mergedTask The merged task.
     */
    private concatInstructions(
        first: TaskInstruction,
        second: TaskInstruction,
        mergedTask: ModelTask): void {

        // Transfer dependencies from second instruction to
        // first instruction.
        second.invertedDependencies.forEach(element => {
            let components = element.dependencies.getValue(second);
            element.dependencies.remove(second);
            components.forEach(component => {
                element.addDependency(first, component);
            });
        });

        // Update task.
        first.task = mergedTask;

        // Remove the second instruction from consideration.
        this.finishInstruction(second);
    }

    /**
     * Tries to find all read-after-write dependencies that can
     * be merged with a particular instruction, along with the
     * rewriters that would merge them.
     * @param instruction The instruction to find merge candidates for.
     * This instruction must be eligible for immediate execution.
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
                    && this.canConcatReadAfterWrite(instruction, otherInstruction)) {

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
     * a component from which the second instruction reads. This
     * instruction must be eligible for immediate execution.
     *
     * @param second The second instruction to merge, which reads
     * from a component to which the first instruction writes.
     */
    private canConcatReadAfterWrite(first: TaskInstruction, second: TaskInstruction): boolean {
        // Two tasks can be merged if they can be executed successively.
        //
        // Let's suppose, for the sake of simplicity, that the first
        // instruction is eligible for immediate execution (this is
        // actually the case when this method is called).
        //
        // Then we can concatenate the first and second tasks if the
        // second task does not have any dependencies other than the
        // first.

        return second.dependencies.size() === 1
            && second.dependencies.getValue(first) !== undefined;
    }
}
