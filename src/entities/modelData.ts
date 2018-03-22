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
     * @param component The component to retrieve.
     */
    public getComponent<T>(component: ModelComponent): T | undefined {
        return this.components.getValue(component);
    }

    /**
     * Gets a particular component of this model. Creates said
     * component if it doesn't exist already.
     * @param component The component to retrieve or create.
     * @param createComponent A function that creates the component
     * if it doesn't exist already.
     */
    public getOrCreateComponent<T>(
        component: ModelComponent,
        createComponent: () => T): T {
        let result = this.getComponent<T>(component);
        if (result === undefined) {
            result = createComponent();
            this.setComponent<T>(component, result);
        }
        return result;
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
