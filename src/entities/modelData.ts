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
     * Creates a data container for the model.
     * @param components A mapping of component types to their values.
     */
    public constructor(
        components?: Collections.Dictionary<ModelComponent, any>) {

        this.changeBuffer = new Collections.Set<ModelComponent>();
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
        console.log("set component is called");
        console.log(this.components.getValue(component));
        console.log(value);
        if (value !== this.components.getValue(component)) {
            console.log("setted component", component);
            this.changeBuffer.add(component);
        }
        this.components.setValue(component, value);
    }

    /**
     *
     */
    public addToChangeBuffer(component: ModelComponent) {
       this.changeBuffer.add(component);
       console.log("buffer: ", this.changeBuffer);
    }

    /**
     * Drains the model's change buffer.
     */
    public drainChangeBuffer(): Collections.Set<ModelComponent> {
        console.log("draining", this.changeBuffer);
        let result = this.changeBuffer;
        this.changeBuffer = new Collections.Set<ModelComponent>();
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
