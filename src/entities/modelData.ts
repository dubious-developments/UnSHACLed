import * as Collections from "typescript-collections";
import { ModelComponent } from "./modelTaskMetadata";

/**
 * A mutable view of the model.
 */
export class ModelData {
    private changeBuffer: Collections.Set<ModelComponent>;

    /**
     * A dictionary that contains all of the model's components.
     */
    private components: Collections.Dictionary<ModelComponent, any>;

    /**
     * Creates an empty model.
     */
    public constructor() {
        this.changeBuffer = new Collections.Set<ModelComponent>();
        this.components = new Collections.Dictionary<ModelComponent, any>();
    }

    /**
     * Gets a particular component of this model.
     */
    public getComponent<T>(component: ModelComponent): T {
        return this.components.getValue(component);
    }

    /**
     * Sets a particular component of this model.
     */
    public setComponent<T>(component: ModelComponent, value: T): void {
        this.components.setValue(component, value);
        this.changeBuffer.add(component);
    }

    /**
     * Drains the model's change buffer.
     */
    public drainChangeBuffer(): Collections.Set<ModelComponent> {
        let result = this.changeBuffer;
        this.changeBuffer = new Collections.Set<ModelComponent>();
        return result;
    }
}
