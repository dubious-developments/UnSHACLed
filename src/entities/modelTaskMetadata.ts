import * as Collections from "typescript-collections";

/**
 * An enumeration of components in the model.
 */
export enum ModelComponent {
    /**
     * The data graph component.
     */
    DataGraph,

    /**
     * A pseudo-component for I/O access. Tasks that use
     * this component must both read from and write to it.
     */
    IO,

    /**
     * The shapes graph component used for SHACL validation.
     */
    SHACLShapesGraph,

    /**
     * The validation report indicating which nodes
     * of the datagraph are conforming to active constraints.
     */
    ValidationReport
}

/**
 * Metadata for tasks that are executed on the model.
 */
export class ModelTaskMetadata {
    /**
     * Gets the default priority for model tasks.
     */
    public static readonly defaultPriority: number = 0;

    /**
     * The set of all values from which the model task may read.
     * It includes elements in the write set that are modified based on their
     * previous value, as opposed to blindly overwritten.
     */
    public readonly readSet: Collections.Set<ModelComponent>;

    /**
     * The set of all values to which the model task writes.
     */
    public readonly writeSet: Collections.Set<ModelComponent>;

    /**
     * The priority assigned to this model task. Relatively high priorities
     * hint that the scheduler should try to execute this task prior to other
     * tasks with lower priorities.
     */
    public readonly priority: number;

    /**
     * Creates metadata for a model task.
     * @param readSet The set of all values from which the model task may read.
     * It includes elements in the write set that are modified based on their
     * previous value, as opposed to blindly overwritten.
     * @param writeSet The set of all values to which the model task writes.
     * @param priority The priority assigned to the model task.
     */
    public constructor(
        readSet: Collections.Set<ModelComponent> | ModelComponent[],
        writeSet: Collections.Set<ModelComponent> | ModelComponent[],
        priority?: number) {

        if (priority) {
            this.priority = priority;
        } else {
            this.priority = ModelTaskMetadata.defaultPriority;
        }

        if (readSet instanceof Collections.Set) {
            this.readSet = readSet;
        } else {
            this.readSet = new Collections.Set<ModelComponent>();
            readSet.forEach(element => {
                this.readSet.add(element);
            });
        }

        if (writeSet instanceof Collections.Set) {
            this.writeSet = writeSet;
        } else {
            this.writeSet = new Collections.Set<ModelComponent>();
            writeSet.forEach(element => {
                this.writeSet.add(element);
            });
        }
    }

    /**
     * Tells if this model task reads from a particular component.
     * @param component The component this model task may read from.
     */
    public readsFrom(component: ModelComponent): boolean {
        return this.readSet.contains(component);
    }

    /**
     * Tells if this model task overwrites a particular component.
     * @param component The component this model will overwrite.
     */
    public writesTo(component: ModelComponent): boolean {
        return this.writeSet.contains(component);
    }
}
