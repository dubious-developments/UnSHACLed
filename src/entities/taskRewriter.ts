import { Task } from "./task";

/**
 * Rewrites tasks that been scheduled but have not yet been
 * executed.
 */
export interface TaskRewriter<TData, TTaskMetadata> {

    // The rules for task merging are rather complex and
    // we don't want the task rewriters themselves to think
    // about them.
    //
    // Instead, we'll push all of this logic in the model task
    // queue and expose only a simple task rewriter API here.

    /**
     * Decides if a particular task is of interest for this
     * task rewriter.
     * @param task The task to inspect.
     * @returns `true` if the task rewriter wants to have the
     * opportunity to maybe rewrite the task in the future;
     * otherwise, `false`.
     */
    isOfInterest(task: Task<TData, TTaskMetadata>): boolean;

    /**
     * Concatenates and rewrites two tasks that are both of interest
     * and eligible for merging. Or doesn't.
     * @param first The first task to merge.
     * @param second The second task to merge.
     * @returns A merged task if the tasks should be merged.
     * Otherwise, `undefined`.
     */
    maybeConcat(
        first: Task<TData, TTaskMetadata>,
        second: Task<TData, TTaskMetadata>):
        Task<TData, TTaskMetadata> | undefined;
}
