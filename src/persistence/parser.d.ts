/**
 * Takes care of (de)serialization.
 */
interface Parser {
    /**
     * Serialize some internal format.
     * @param data
     * @param {string} mime
     * @param {(result: any) => void} andThen
     */
    serialize(data: any, mime: string, andThen: (result: any) => void);

    /**
     * Parse some form of encoded content.
     * @param {string} content
     * @param {string} mime
     * @param {(result: string) => void} andThen
     */
    parse(content: string, mime: string, andThen: (result: string) => void);

    /**
     * Retrieve the data contained by this Parser.
     */
    getData();

    /**
     * Clean whatever is contained by this Parser.
     */
    clean();
}