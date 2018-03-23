import { Task } from "./task";

/**
 * Rewrites tasks that been scheduled but have not yet been
 * executed.
 */
export interface TaskRewriter<TData, TTaskMetadata> {

    // The main thing we want to achieve by rewriting tasks
    // is to merge tasks---to reduce the amount of work
    // that we need to do by reasoning about how tasks
    // interact.
    //
    // Tasks can only be merged if doing so does not
    // introduce observable side-effects for other tasks.
    //
    // For example, suppose that we have the following
    // dependency graph:
    //
    //                A
    //            (write X)
    //             /     \
    //            /       \
    //           /         \
    //          v           v
    //          B           C
    //     (read X)      (read X)
    //     (write Y)     (write Z)
    //                      |
    //                      |
    //                      v
    //                      D
    //                   (read Z)
    //                   (write X)
    //
    // The individual dependency graphs in X, Y and Z
    // look like this.
    //
    //       X            Y            Z
    //     -----        -----        -----
    //
    //       A            A            A
    //      / \
    //     B   C        B   C        B   C
    //                                   |
    //         D            D            D
    //
    // Now imagine that we want to merge A and C. This can
    // only happen if the following conditions are met:
    //
    //   * The merged task (A+C) replaces task A, not task C.
    //     Otherwise, task B might be executed before task A+C
    //     and that would break the world.
    //
    //     This is actually not such a big deal when we have
    //     data flow execution: we just make A+C a dependency
    //     of all instructions that are dependent on either
    //     A or C.
    //
    //     In general, *the set of dependent tasks of the
    //     merged task is the union of the individual tasks'
    //     dependencies.*
    //
    //   * C does not write to a component from which B reads.
    //
    //     More formally, *tasks can only be merged if, for
    //     every type of component, every dependent task of
    //     the merged task is (indirectly) dependent on every
    //     task to merge that writes to that component.*
    //
    //     That is, we can't have a task that depends on a
    //     write of the merged task but not on all tasks to
    //     merge that write to that component.
    //
    // Now suppose that we wanted to merge A and D. Clearly
    // that can't happen, because have an intervening task
    // C that needs to execute after A and prior to D. So we'll
    // introduce another requirement.
    //
    //   * Tasks cannot be merged if there exists some task T
    //     such that T is dependent on one task to merge and
    //     another task to merge is dependent on T.
    //
    // These rules are all rather complex and we don't want
    // the task rewriters themselves to think about them.
    // Instead, we'll push all of this logic in the model task
    // queue and expose only a simple task rewriter API.

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
     * Merges and rewrites two tasks that are both of interest
     * and eligible for merging. Or doesn't.
     * @param first The first task to merge.
     * @param second The second task to merge.
     * @returns A merged task if the tasks should be merged.
     * Otherwise, `undefined`.
     */
    maybeRewrite(
        first: Task<TData, TTaskMetadata>,
        second: Task<TData, TTaskMetadata>):
        Task<TData, TTaskMetadata> | undefined;
}
