import * as Collections from "typescript-collections";
import { TaskProcessor } from "./taskProcessor";

/**
 * Models the data handled by the UnSHACLed application.
*/
export class Model {
    /**
     * The task processor for the model.
    */
   public tasks: TaskProcessor<ModelData, ModelTaskMetadata>;

    /**
     * Creates an empty model.
    */
    public constructor() {
        this.tasks = new TaskProcessor<ModelData, ModelTaskMetadata>(
            new ModelData());
    }
}

/**
 * Contains a mutable view of a model.
*/
export class ModelData {

}

/**
 * An enumeration of components in the model.
*/
export enum ModelComponent {
    DataGraph,
}

/**
 * Metadata for tasks that are executed on the model.
*/
export class ModelTaskMetadata {
    public constructor(
        public readSet: Collections.Set<ModelComponent>,
        public writeSet: Collections.Set<ModelComponent>) { }

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
