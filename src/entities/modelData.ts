import * as Collections from "typescript-collections";
import * as Immutable from "immutable";
import { ModelComponent } from "./modelTaskMetadata";

type AccessBuffer = Immutable.Set<ModelComponent>;
type AccessBufferPair = { readBuffer: AccessBuffer, writeBuffer: AccessBuffer };

/**
 * A mutable view of the model.
 */
export class ModelData {
    private writeBuffer: AccessBuffer;
    private readBuffer: AccessBuffer;

    /**
     * A dictionary that contains all of the model's components.
     */
    private components: Collections.Dictionary<ModelComponent, any>;

    /**
     * Creates a data container for the model.
     * @param components A mapping of component types to their values.
     * @param readSet The set of all model components that the model data
     * is allowed to read from.
     * @param writeSet The set of all model components that the model data
     * is allowed to write to.
     */
    public constructor(
        components?: Collections.Dictionary<ModelComponent, any>,
        public readonly readSet?: AccessBuffer,
        public readonly writeSet?: AccessBuffer) {

        this.writeBuffer = Immutable.Set<ModelComponent>();
        this.readBuffer = Immutable.Set<ModelComponent>();
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

        if (this.readSet
            && !this.readSet.contains(component)
            && !this.writeBuffer.contains(component)) {

            // Looks like the task is writing to an element that
            // it doesn't have access to.
            throw Error(
                `Intercepted a read from '${component}', which is not in the read set. ` +
                `Consider adding '${component}' to the read set if the read is intentional.`);
        }
        return this.getComponentUnchecked(component);
    }

    /**
     * Gets a particular component of this model. Elides the legality
     * check associated with this operation.
     * @param component The component to retrieve.
     */
    public getComponentUnchecked<T>(component: ModelComponent): T | undefined {

        if (this.components.containsKey(component)
            && !this.writeBuffer.contains(component)) {

            // Only update the read buffer if the component wasn't written to before.
            this.readBuffer = this.readBuffer.add(component);
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
            if (this.writeSet && !this.writeSet.contains(component)) {
                // Looks like the task wrote to an element that
                // it doesn't have access to.
                throw Error(
                    `Intercepted a write to '${component}', which is not in the write set. ` +
                    `Consider adding '${component}' to the write set if the write is intentional.`);
            }

            this.setComponentUnchecked(component, value);
        }
    }

    /**
     * Sets a particular component of this model. Elides the legality check
     * associated with this operation.
     */
    public setComponentUnchecked<T>(component: ModelComponent, value: T): void {

        if (value !== this.components.getValue(component)) {

            // Record the write in the write buffer.
            this.writeBuffer = this.writeBuffer.add(component);
        }

        this.components.setValue(component, value);
    }

    /**
     * Drains the model's read, write buffer pair.
     */
    public drainBuffers(): AccessBufferPair {
        let readBuf = this.readBuffer;
        let writeBuf = this.writeBuffer;
        this.readBuffer = Immutable.Set<ModelComponent>();
        this.writeBuffer = Immutable.Set<ModelComponent>();
        return { readBuffer: readBuf, writeBuffer: writeBuf };
    }

    /**
     * Takes a peek at the read, write buffer pair without
     * modifying them.
     */
    public peekBuffers(): AccessBufferPair {
        return { readBuffer: this.readBuffer, writeBuffer: this.writeBuffer };
    }

    /**
     * Creates a shallow copy of this model data's components.
     * Note that the change buffer is not copied.
     * @param readSet The set of all model components that the
     * cloned model data is allowed to read from.
     * @param writeSet The set of all model components that the
     * model data is allowed to write to.
     */
    public clone(readSet?: AccessBuffer, writeSet?: AccessBuffer): ModelData {
        let componentCopy = new Collections.Dictionary<ModelComponent, any>();
        this.components.forEach((key, value) => {
            componentCopy.setValue(key, value);
        });
        return new ModelData(componentCopy, readSet, writeSet);
    }
}
