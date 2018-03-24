import * as Collections from "typescript-collections";
import { TaskInstruction, ModelTask } from "./taskInstruction";
import { TaskRewriter } from "./taskRewriter";
import { ModelData } from "./modelData";
import { ModelTaskMetadata } from "./modelTaskMetadata";

/**
 * The type of task rewriters used by the model.
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
