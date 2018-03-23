import IndexedFormula from "./rdflib/indexed-formula";
import Statement from "./rdflib/statement";

/**
 * A wrapper class for library-specific triple stores.
 */
export class Graph {
    private N3Store: any;
    private SHACLStore: any;
    private prefixes: {};

    /**
     * Create a new Graph.
     */
    public constructor() {
        let N3 = require("n3");
        this.N3Store = N3.Store();
        this.SHACLStore = new IndexedFormula();
        this.prefixes = {};
    }

    /**
     * Retrieve the representation of the Graph used by N3 API.
     * @returns {any}
     */
    public getN3Store(): any {
        return this.N3Store;
    }

    /**
     * Retrieve the representation of the Graph used by SHACL API.
     * @returns {any}
     */
    public getSHACLStore(): any {
        return this.SHACLStore;
    }

    /**
     * Add a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string): void {
        this.N3Store.addTriple(subject, predicate, object);
        this.SHACLStore.add(new Statement(subject, predicate, object, null));
    }

    /**
     * Remove a triple from the Graph.
     * @param {string} subject
     * @param {string} predicate
     * @param {string} object
     */
    public removeTriple(subject: string, predicate: string, object: string): void {
        this.N3Store.removeTriple(subject, predicate, object);
        this.SHACLStore.remove(new Statement(subject, predicate, object));
    }

    /**
     * Add multiple triples to the Graph.
     * @param triples
     */
    public addTriples(triples: Array<any>): void {
        this.N3Store.addTriples(triples);
        triples.forEach(t => {
            this.SHACLStore.add(new Statement(t.subject, t.predicate, t.object, null));
        });
    }

    /**
     * Remove multiple triples from the Graph.
     * @param {Array<any>} triples
     */
    public removeTriples(triples: Array<any>): void {
        this.N3Store.removeTriples(triples);
        triples.forEach(t => {
            this.SHACLStore.remove(new Statement(t.subject, t.predicate, t.object));
        });
    }

    /**
     * Retrieve all the prefixes in this Graph.
     * @returns {any}
     */
    public getPrefixes(): {} {
        return this.prefixes;
    }

    /**
     * Add a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string): void {
        this.N3Store.addPrefix(prefix, iri);
        this.prefixes[prefix] = iri;
    }

    /**
     * Add multiple presfixes to this Graph.
     * @param prefixes
     */
    public addPrefixes(prefixes: {}): void {
        this.N3Store.addPrefixes(prefixes);
        Object.keys(prefixes).forEach(k => {
            this.prefixes[k] = prefixes[k];
        });
    }

    /**
     * Merges this graph with another graph.
     * @param {Graph} other
     */
    public merge(other: Graph): void {
        this.addPrefixes(other.getPrefixes());
        this.N3Store.addTriples(other.N3Store.getTriples());
        this.SHACLStore.addAll(other.SHACLStore.match());
    }
}