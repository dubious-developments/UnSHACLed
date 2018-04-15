import { reverse } from "dns";

/**
 * A class that presents an "immutable" (but not re-entrant) view of
 * a mutable value by undoing/redoing the actions performed on
 * that value.
 */
export class TimeCapsule<T> {
    // The idea behind a time capsule is to efficiently fake
    // immutability by taking a mutable data structure and
    // remembering how to perform each state change.
    //
    // For example, suppose that we have the following tree of
    // changes to a data structure.
    //
    //     C <---- B <---- A <---- A' <---- A'' <---- ... <---- Root
    //                     |
    //                     v
    //             E <---- D
    //
    // The tricky thing with immutable data structures is that
    // A, B, C, D and E's perspectives are all equally valid,
    // that is, there is no "canonical" form of the data structure
    // *and* the "history" of the data structure is always a tree.
    //
    // What a time capsule instance does is the following: it
    // assigns an "instant" to each version of the data structure.
    // (Actually, the `TimeCapsule<T>` class *is* such an instant,
    // but making a distinction between all time capsule instants
    // and just one is useful for explaining how the whole thing
    // works.) When the state for one instant is requested, the
    // time capsule modifies the mutable data it manages by finding
    // a path from the current instant and the desired instance and
    // undoing/redoing the changes along that path.
    //
    // For example, suppose that the current instant is 'C' and we
    // want to get to instant 'E'. Then we need to undo 'C' and 'B'
    // as well as redo 'D' and 'E'.

    /**
     * Creates a time capsule instant.
     * @param state The shared state.
     * @param parent The parent state of this time capsule instant.
     * @param undoChange Undoes the change performed by this time capsule state.
     * @param redoChange Redoes the change performed by this time capsule state.
     * @param generation The time capsule instant's generation, i.e., the number
     * of edits from the root. The generation is used to do less work when finding
     * the last common ancestor of two states.
     */
    private constructor(
        private readonly state: TimeCapsuleState<T>,
        private readonly parent: TimeCapsule<T>,
        private readonly undoChange: (state: T) => void,
        private readonly redoChange: (state: T) => void,
        private readonly generation: number) {
    }

    private static findLastCommonAncestor<T>(
        first: TimeCapsule<T>,
        second: TimeCapsule<T>): TimeCapsule<T> {

        // Step one: find an ancestor for `first` and `second`
        // with generation `min(first.generation, second.generation)`.
        while (first.generation > second.generation) {
            first = first.parent;
        }
        while (second.generation > first.generation) {
            second = second.parent;
        }

        // Step two: walk the ancestor tree of `first` and `second`
        // until we find a common ancestor. This will always be the
        // last common ancestor because `first === second` implies
        // `first.parent === second.parent`.
        while (first !== second) {
            first = first.parent;
            second = second.parent;
        }

        return first;
    }

    /**
     * Creates a time capsule from a piece of data.
     * @param data The data to manage.
     */
    public static create<T>(data: T): TimeCapsule<T> {
        let result = new TimeCapsule<T>(
            new TimeCapsuleState<T>(data),
            undefined,
            (state: T) => { },
            (state: T) => { },
            0);
        result.state.currentInstant = result;
        return result;
    }

    /**
     * Gets a list of all instant along the path to an ancestor,
     * including this instant and the ancestor.
     * @param ancestor An ancestor time instant.
     */
    private pathToAncestor(ancestor: TimeCapsule<T>): TimeCapsule<T>[] {
        let results = new Array<TimeCapsule<T>>();
        let instant: TimeCapsule<T> = this;
        while (instant != ancestor) {
            results.push(instant);
            instant = instant.parent;
        }
        results.push(ancestor);
        return results;
    }

    /**
     * Creates a modified version of this time capsule instant.
     * @param doChange Performs a change.
     * @param undoChange Rolls back the change performed by `doChange`.
     */
    public modify(
        doChange: (state: T) => void,
        undoChange: (state: T) => void): TimeCapsule<T> {

        return new TimeCapsule<T>(
            this.state,
            this,
            undoChange,
            doChange,
            this.generation + 1);
    }

    /**
     * Gets the mutable data managed by the time capsule
     * for this instant.
     */
    public get(): T {
        // We need to do the following:
        //
        //   * We need to find the last common ancestor of
        //     this instant and the current instant.
        //
        //   * Then we need to undo/redo changes until we
        //     find the Universe to our liking. (or, um, at
        //     least the tiny piece of the Universe we're in
        //     charge of managing)

        let data = this.state.data;
        let currentInstant = this.state.currentInstant;

        if (currentInstant === this) {
            return data;
        }

        let ancestor = TimeCapsule.findLastCommonAncestor<T>(
            this,
            currentInstant);

        for (let instant of currentInstant.pathToAncestor(ancestor).slice(1)) {
            instant.undoChange(data);
        }

        for (let instant of this.pathToAncestor(ancestor).reverse().slice(1)) {
            instant.redoChange(data);
        }

        return data;
    }
}

/**
 * The state shared by a number of time capsule instants.
 */
class TimeCapsuleState<T> {
    /**
     * The data shared by the time capsule instants.
     */
    public data: T;

    /**
     * The current instant the time capsule is in.
     */
    public currentInstant: TimeCapsule<T>;

    /**
     * Creates a time capsule state from a piece of data to
     * manage.
     * @param data The data to manage.
     */
    public constructor(data: T) {
        this.data = data;
        this.currentInstant = undefined;
    }
}
