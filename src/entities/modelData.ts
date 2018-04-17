import * as Collections from "typescript-collections";
import { ModelComponent } from "./modelTaskMetadata";

/**
 * A mutable view of the model.
 */
export class ModelData {
    private writeBuffer: Collections.Set<ModelComponent>;

    private readBuffer: Collections.Set<ModelComponent>;

    /**
     * A dictionary that contains all of the model's components.
     */
    private components: Collections.Dictionary<ModelComponent, any>;

    /**
     * Creates a data container for the model.
     * @param components A mapping of component types to their values.
     */
    public constructor(
        components?: Collections.Dictionary<ModelComponent, any>) {

        this.writeBuffer = new Collections.Set<ModelComponent>();
        this.readBuffer = new Collections.Set<ModelComponent>();
        if (components) {
            this.components = components;
        } else {
            this.components = new Collections.Dictionary<ModelComponent, any>();
        }
    }

    /**
     * Gets a particular component of this model.
     * @param component The component to retrieve.
     */
    public getComponent<T>(component: ModelComponent): T | undefined {

        if (this.components.containsKey(component)
            && !this.writeBuffer.contains(component)) {

            // Only update the read buffer if the component wasn't written to before.
            this.readBuffer.add(component);
        }
        return this.components.getValue(component);
    }

    /**
     * Gets a particular component of this model. Creates said
     * component if it doesn't exist already.
     * @param component The component to retrieve or create.
     * @param createComponent A function that creates the component
     * if it doesn't exist already.
     */
    public getOrCreateComponent<T>(component: ModelComponent, createComponent: () => T): T {

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

        if (value !== this.components.getValue(component)) {
            this.writeBuffer.add(component);
        }
        this.components.setValue(component, value);
    }

    /**
     * Drains the model's read buffer.
     */
    public drainReadBuffer(): Collections.Set<ModelComponent> {
        let result = this.readBuffer;
        this.readBuffer = new Collections.Set<ModelComponent>();
        return result;
    }

    /**
     * Drains the model's write buffer.
     */
    public drainWriteBuffer(): Collections.Set<ModelComponent> {
        let result = this.writeBuffer;
        this.writeBuffer = new Collections.Set<ModelComponent>();
        return result;
    }

    /**
     * Creates a shallow copy of this model data's components.
     * Note that the change buffer is not copied.
     */
    public clone(): ModelData {
        let componentCopy = new Collections.Dictionary<ModelComponent, any>();
        this.components.forEach((key, value) => {
            componentCopy.setValue(key, value);
        });
        return new ModelData(componentCopy);
    }
}
