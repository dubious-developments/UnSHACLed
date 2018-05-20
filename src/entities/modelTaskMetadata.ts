import * as Collections from "typescript-collections";
import * as Immutable from "immutable";

/**
 * An enumeration of components in the model.
 */
export enum ModelComponent {
    /**
     * The data graph component.
     */
    DataGraph = "DataGraph",

    /**
     * A pseudo-component for I/O access. Tasks that use
     * this component must both read from and write to it.
     */
    IO = "IO",

    /**
     * A pseudo-component for UI access.
     */
    UI = "UI",

    /**
     * The shapes graph component used for SHACL validation.
     */
    SHACLShapesGraph = "SHACLShapesGraph",

    /**
     * The validation report indicating which nodes
     * of the datagraph are conforming to active constraints.
     */
    ValidationReport = "ValidationReport",

    /**
     * A component used to represent any number of individual components
     * that make up "the workspace". This component is only here to allow the
     * DAOs to keep working.
     */
    Workspace = "Workspace"
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
    public readonly readSet: Immutable.Set<ModelComponent>;

    /**
     * The set of all values to which the model task writes.
     */
    public readonly writeSet: Immutable.Set<ModelComponent>;

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
        readSet: Immutable.Set<ModelComponent> | Collections.Set<ModelComponent> | ModelComponent[],
        writeSet: Immutable.Set<ModelComponent> | Collections.Set<ModelComponent> | ModelComponent[],
        priority?: number) {

        if (priority) {
            this.priority = priority;
        } else {
            this.priority = ModelTaskMetadata.defaultPriority;
        }

        this.readSet = ModelTaskMetadata.toImmutableSet(readSet);
        this.writeSet = ModelTaskMetadata.toImmutableSet(writeSet);
    }

    private static toImmutableSet(
        arg: Immutable.Set<ModelComponent>
            | Collections.Set<ModelComponent>
            | ModelComponent[]): Immutable.Set<ModelComponent> {

        if (arg instanceof Immutable.Set) {
            return <Immutable.Set<ModelComponent>> arg;
        } else if (arg instanceof Collections.Set) {
            return Immutable.Set<ModelComponent>(arg.toArray());
        } else {
            return Immutable.Set<ModelComponent>(arg);
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
