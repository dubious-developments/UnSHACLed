import * as Immutable from "immutable";
import { ModelData } from "../entities/modelData";
import { ModelComponent } from "../entities/modelTaskMetadata";

/**
 * A structure that is to be stored inside the Model.
 * Possibly contains multiple composite parts all mapped to an identifier.
 * An example component might contain multiple data graphs, each of which is associated with a filename.
 */
export class Component<T> {

    /**
     * Creates a new component.
     * @param parts A mapping of part keys to parts.
     */
    public constructor(
        private readonly parts?: Immutable.Map<string, T>) {
        
        if (!parts) {
            this.parts = Immutable.Map<string, T>();
        }
    }

    /**
     * Retrieves all keys in the component.
     */
    public getAllKeys(): Immutable.Iterator<string> {
        return this.parts.keys();
    }

    /**
     * Retrieves a part of the component.
     * @param key The key for the part to retrieve.
     */
    public getPart(key: string): T {
        return this.parts.get(key);
    }

    /**
     * Bind a value to a given key. Returns a component
     * with the updated (key, value) pair.
     * @param key The key to bind a value to.
     * @param value The value to bind to `key`.
     */
    public withPart(key: string, value: T): Component<T> {
        return new Component<T>(this.parts.set(key, value));
    }
}
