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
     * Decides if a particular task is of interest to this
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

type IsOfInterestFunction<TData, TTaskMetadata> = (
    task: Task<TData, TTaskMetadata>) =>
    boolean;

type MaybeConcatFunction<TData, TTaskMetadata> = (
    first: Task<TData, TTaskMetadata>,
    second: Task<TData, TTaskMetadata>) =>
    Task<TData, TTaskMetadata> | undefined;

/**
 * A simple task rewriter implementation that uses functions
 * to implement its is-of-interest and maybe-concat operations.
 */
export class SimpleTaskRewriter<TData, TTaskMetadata> implements TaskRewriter<TData, TTaskMetadata> {
    /**
     * Creates a simple task method from two functions.
     * @param isOfInterestImpl Decides if a particular task is of
     * interest to this task rewriter.
     * @param maybeConcatImpl Concatenates and rewrites two tasks
     * that are both of interest and eligible for merging.
     * Or doesn't.
     */
    public constructor(
        private readonly isOfInterestImpl: IsOfInterestFunction<TData, TTaskMetadata>,
        private readonly maybeConcatImpl: MaybeConcatFunction<TData, TTaskMetadata>) {

    }

    /**
     * Decides if a particular task is of interest for this
     * task rewriter.
     * @param task The task to inspect.
     * @returns `true` if the task rewriter wants to have the
     * opportunity to maybe rewrite the task in the future;
     * otherwise, `false`.
     */
    public isOfInterest(task: Task<TData, TTaskMetadata>): boolean {
        return this.isOfInterestImpl(task);
    }

    /**
     * Concatenates and rewrites two tasks that are both of interest
     * and eligible for merging. Or doesn't.
     * @param first The first task to merge.
     * @param second The second task to merge.
     * @returns A merged task if the tasks should be merged.
     * Otherwise, `undefined`.
     */
    public maybeConcat(
        first: Task<TData, TTaskMetadata>,
        second: Task<TData, TTaskMetadata>): Task<TData, TTaskMetadata> {

        return this.maybeConcat(first, second);
    }
}
