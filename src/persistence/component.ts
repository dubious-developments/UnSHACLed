import * as Collections from "typescript-collections";

/**
 * A part of a component.
 */
export interface Part {

    /**
     * Merge this part with another part
     * @param {Part} other
     */
    merge(other: Part): void;
}

/**
 * A structure that is to be stored inside the Model.
 * Possibly contains multiple composite parts all mapped to an identifier.
 * An example component might contain multiple data graphs, each of which is associated with a filename.
 */
export class Component {

    private static ROOT: string = "ROOT";
    private parts: Collections.Dictionary<string, Part>;

    /**
     * Create a new Component.
     */
    public constructor() {
        this.parts = new Collections.Dictionary<string, Part>();
    }

    /**
     * Retrieve a part of the Component
     * @param {string} key
     * @returns {T}
     */
    public getPart(key: string): Part | undefined {
        return this.parts.getValue(key);
    }

    /**
     * Retrieve a part of the Component,
     * or in case the Part does not exist create a new part for the given key.
     * @param {string} key
     * @param createPart
     * @returns {any}
     */
    public getOrCreatePart(key: string, createPart: () => Part): Part {
        let part = this.getPart(key);
        if (!part) {
            part = createPart();
            this.setPart(key, part);
        }
        return part;
    }

    /**
     * Bind a value to a given key.
     * @param {string} key
     * @param value
     */
    public setPart(key: string, value: Part): void {
        this.parts.setValue(key, value);
    }

    /**
     * Retrieve the root part of this component.
     * @returns {Part | undefined}
     */
    public getRoot() {
        return this.getPart(Component.ROOT);
    }

    /**
     * Retrieve the root part of this component or create a new root.
     * @param {() => Part} createPart
     * @returns {Part}
     */
    public getOrCreateRoot(createPart: () => Part) {
        return this.getOrCreatePart(Component.ROOT, createPart);
    }

    /**
     * Set the value of the root part of this component.
     * @param {Part} value
     */
    public setRoot(value: Part) {
        this.setPart(Component.ROOT, value);
    }
}