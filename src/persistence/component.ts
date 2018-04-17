import * as Collections from "typescript-collections";

/**
 * A structure that is to be stored inside the Model.
 * Possibly contains multiple composite parts all mapped to an identifier.
 * An example component might contain multiple data graphs, each of which is associated with a filename.
 */
export class Component {

    private static ROOT: string = "ROOT";
    private parts: Collections.Dictionary<string, any>;
    private changed: Collections.Set<any>;

    /**
     * Create a new Component.
     */
    public constructor() {
        this.parts = new Collections.Dictionary<string, any>();
        this.changed = new Collections.Set<any>();
    }

    /**
     * Retrieve all keys.
     * @returns {string[]}
     */
    public getAllKeys() {
        return this.parts.keys();
    }

    /**
     * Retrieve a part of the component.
     * @param {string} key
     * @returns {T}
     */
    public getPart<T>(key: string): T | undefined {
        return this.parts.getValue(key);
    }

    /**
     * Retrieve a part of the Component,
     * or in case the Part does not exist create a new part for the given key.
     * @param {string} key
     * @param createPart
     * @returns {any}
     */
    public getOrCreatePart<T>(key: string, createPart: () => T): T {
        let part = this.getPart<T>(key);
        if (!part) {
            part = createPart();
            this.setPart<T>(key, part);
        }
        return part;
    }

    /**
     * Bind a value to a given key,
     * and add this value to the set of changed values.
     * @param {string} key
     * @param value
     */
    public setPart<T>(key: string, value: T): void {
        this.parts.setValue(key, value);
        this.changed.add(value);
    }

    /**
     * Retrieve the root part of this component.
     * @returns {T | undefined}
     */
    public getRoot<T>(): T | undefined {
        return this.getPart(Component.ROOT);
    }

    /**
     * Retrieve the root part of this component or create a new root.
     * @param {() => Part} createPart
     * @returns {T}
     */
    public getOrCreateRoot<T>(createPart: () => T): T {
        return this.getOrCreatePart(Component.ROOT, createPart);
    }

    /**
     * Set the value of the root part of this component.
     * @param {T} value
     */
    public setRoot<T>(value: T): void {
        this.setPart(Component.ROOT, value);
    }

    /**
     * Retrieve all parts contained in this component.
     */
    public getParts(): any[] {
        return this.parts.values();
    }

    /**
     * Retrieve all parts, barring the root.
     * @returns {any[]}
     */
    public getCompositeParts(): any[] {
        let relevantParts = new Array<any>();
        this.getAllKeys().forEach(k => {
            if (k !== Component.ROOT) {
                relevantParts.push(this.parts.getValue(k));
            }
        });

        return relevantParts;
    }

    /**
     * Retrieve and subsequently clear the changed parts of this component.
     * @returns {Set<any>}
     */
    public getChanged(): Collections.Set<any> {
        let changed = this.changed;
        this.changed = new Collections.Set<any>();
        return changed;
    }
}