import { IndexedFormula, Statement } from "rdflib";

type Triple = { subject: string, predicate: string, object: string };

/**
 * An mutable wrapper for library-specific triple stores.
 */
export class Graph {
    private data: GraphData;

    /**
     * Create a new Graph.
     */
    public constructor() {
        this.data = new GraphData();
    }

    /**
     * Runs a function on the N3 graph store.
     * NOTE: the function is not allowed to modify
     * the N3 store.
     * @param func The function to apply.
     */
    public queryN3Store<T>(func: (store: any) => T): T {
        // TODO: delete this hack.
        return func(this.data.n3Store);
    }

    /**
     * Runs a function on the graph store.
     * NOTE: the function is not allowed to modify
     * the graph store.
     * @param func The function to apply.
     */
    public query<T>(func: (store: any) => T): T {
        return func(this.data.store);
    }

    /**
     * Add a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string) {
        this.data.addTriple(subject, predicate, object);
    }

    /**
     * Remove a triple from the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public removeTriple(subject: string, predicate: string, object: string) {
        this.data.removeTriple(subject, predicate, object);
    }

    /**
     * Add multiple triples to the Graph.
     * @param triples The triples to add.
     */
    public addTriples(triples: Triple[]) {
        this.data.addTriples(triples);
    }

    /**
     * Remove multiple triples from the Graph.
     * @param triples The triples to remove.
     */
    public removeTriples(triples: Triple[]) {
        this.data.removeTriples(triples);
    }

    /**
     * Retrieve all the prefixes in this Graph.
     */
    public getPrefixes(): {} {
        return this.data.getPrefixes();
    }

    /**
     * Add a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string) {
        this.data.addPrefix(prefix, iri);
    }

    /**
     * Add multiple presfixes to this Graph.
     * @param prefixes
     */
    public addPrefixes(prefixes: {}) {
        this.data.addPrefixes(prefixes);
    }

    /**
     * Merges this graph with another graph.
     * @param other The graph to merge with this graph.
     */
    public merge(other: Graph) {
        this.data.merge(other.data);
    }
}

/**
 * A thin wrapper around a library-specific graph store.
 */
class GraphData {
    /**
     * The rdflib graph store managed by this class.
     */
    public store: any;

    /**
     * The N3 graph store.
     */
    public n3Store: any;

    private prefixes: {};

    public constructor() {
        let N3 = require("n3");
        this.n3Store = N3.Store();
        this.store = new IndexedFormula();
        this.prefixes = {};
    }

    /**
     * Add a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string) {
        this.n3Store.addTriple(subject, predicate, object);
        this.store.add(new Statement(subject, predicate, object, this.store));
    }

    /**
     * Remove a triple from the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public removeTriple(subject: string, predicate: string, object: string) {
        this.n3Store.removeTriple(subject, predicate, object);
        this.store.remove(new Statement(subject, predicate, object));
    }

    /**
     * Add multiple triples to the Graph.
     * @param triples The triples to add.
     */
    public addTriples(triples: Triple[]) {
        this.n3Store.addTriples(triples);
        triples.forEach(t => {
            this.store.add(new Statement(t.subject, t.predicate, t.object, this.store));
        });
    }

    /**
     * Remove multiple triples from the Graph.
     * @param triples The triples to remove.
     */
    public removeTriples(triples: Triple[]) {
        this.n3Store.removeTriples(triples);
        triples.forEach(t => {
            this.store.remove(new Statement(t.subject, t.predicate, t.object));
        });
    }

    /**
     * Retrieve all the prefixes in this Graph.
     */
    public getPrefixes(): {} {
        return this.prefixes;
    }

    /**
     * Add a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string) {
        this.n3Store.addPrefix(prefix, iri);
        this.prefixes[prefix] = iri;
    }

    /**
     * Add multiple presfixes to this Graph.
     * @param prefixes The prefixes to add.
     */
    public addPrefixes(prefixes: {}) {
        this.n3Store.addPrefixes(prefixes);
        Object.keys(prefixes).forEach(k => {
            this.prefixes[k] = prefixes[k];
        });
    }

    /**
     * Merges this graph with another graph.
     * @param other The graph data to merge with this graph.
     */
    public merge(other: GraphData) {
        this.n3Store.addTriples(other.n3Store.getTriples());
        this.addPrefixes(other.getPrefixes());
        this.store.addAll(other.store.match());
    }
}
