import * as Collections from "typescript-collections";

/**
 * A structure that is to be stored inside the Model.
 * Possibly contains multiple composite parts all mapped to an identifier.
 * An example component might contain multiple data graphs, each of which is associated with a filename.
 */
export class Component {
    private parts: Collections.Dictionary<string, any>;

    /**
     * Create a new Component.
     */
    public constructor() {
        this.parts = new Collections.Dictionary<string, any>();
    }

    /**
     * Retrieve a part of the component.
     * @param {string} key
     * @returns {any}
     */
    public getPart(key: string): any {
        return this.parts.getValue(key);
    }

    /**
     * Bind a value to a given key.
     * @param {string} key
     * @param value
     */
    public setPart(key: string, value: any): void {
        this.parts.setValue(key, value);
    }
}