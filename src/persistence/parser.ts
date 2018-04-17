/**
 * Takes care of (de)serialization.
 */
interface Parser<T> {
    /**
     * Serialize some internal format.
     * @param data
     * @param mime
     * @param andThen
     */
    serialize(data: T, mime: string, andThen: ((result: string) => void) | null): void;

    /**
     * Parse some form of encoded content.
     * @param content
     * @param mime
     * @param andThen
     */
    parse(content: string, mime: string, andThen: ((result: T) => void) | null): void;

    /**
     * Retrieve the data contained by this Parser.
     */
    getData(): T;

    /**
     * Clean whatever is contained by this Parser.
     */
    clean(): void;
}
