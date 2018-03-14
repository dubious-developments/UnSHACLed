/**
 * A wrapper class for a library-specific triple store.
 */
export class Graph {
    private store: any;
    private prefixes: any;

    /**
     * Create a new Graph.
     * @param store
     */
    public constructor(store: any) {
        this.store = store;
        this.prefixes = {};
    }

    /**
     * Add a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: any, predicate: any, object: any) {
        this.store.addTriple(subject, predicate, object);
    }

    /**
     * Add multiple triples to the Graph.
     * @param triples
     */
    public addTriples(triples: any) {
        this.store.addTriples(triples);
    }

    /**
     * Retrieve all the triples in this Graph.
     * @returns {any}
     */
    public getTriples() {
        return this.store.getTriples();
    }

    /**
     * Retrieve the number of triples in this Graph.
     * @returns {any}
     */
    public countTriples() {
        return this.store.countTriples();
    }

    /**
     * Add a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: any, iri: any) {
        this.store.addPrefix(prefix, iri);
        this.prefixes[prefix] = iri;
    }

    /**
     * Add multiple presfixes to this Graph.
     * @param prefixes
     */
    public addPrefixes(prefixes: any) {
        this.store.addPrefixes(prefixes);
        Object.keys(this.prefixes).forEach(k => {
            this.addPrefix(k, prefixes[k]);
        });
    }

    /**
     * Retrieve all the prefixes in this Graph.
     * @returns {any}
     */
    public getPrefixes() {
        return this.prefixes;
    }
}