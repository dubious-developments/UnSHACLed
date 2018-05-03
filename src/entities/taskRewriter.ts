/**
 * Rewrites tasks that been scheduled but have not yet been
 * executed.
 */
export interface TaskRewriter<TTask> {

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
    isOfInterest(task: TTask): boolean;

    /**
     * Concatenates and rewrites two tasks that are both of interest
     * and eligible for merging. Or doesn't.
     * @param first The first task to merge.
     * @param second The second task to merge.
     * @returns A merged task if the tasks should be merged.
     * Otherwise, `undefined`.
     */
    maybeConcat(
        first: TTask,
        second: TTask):
        TTask | undefined;
}

type IsOfInterestFunction<TTask> = (
    task: TTask) =>
    boolean;

type MaybeConcatFunction<TTask> = (
    first: TTask,
    second: TTask) =>
    TTask | undefined;

/**
 * A simple task rewriter implementation that uses functions
 * to implement its is-of-interest and maybe-concat operations.
 */
export class SimpleTaskRewriter<TTask> implements TaskRewriter<TTask> {
    /**
     * Creates a simple task method from two functions.
     * @param isOfInterestImpl Decides if a particular task is of
     * interest to this task rewriter.
     * @param maybeConcatImpl Concatenates and rewrites two tasks
     * that are both of interest and eligible for merging.
     * Or doesn't.
     */
    public constructor(
        private readonly isOfInterestImpl: IsOfInterestFunction<TTask>,
        private readonly maybeConcatImpl: MaybeConcatFunction<TTask>) {

    }

    /**
     * Decides if a particular task is of interest for this
     * task rewriter.
     * @param task The task to inspect.
     * @returns `true` if the task rewriter wants to have the
     * opportunity to maybe rewrite the task in the future;
     * otherwise, `false`.
     */
    public isOfInterest(task: TTask): boolean {
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
        first: TTask,
        second: TTask): TTask | undefined {

        return this.maybeConcatImpl(first, second);
    }
}
