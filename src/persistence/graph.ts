import {IndexedFormula, Statement} from "rdflib";

/**
 * A wrapper class for library-specific triple stores.
 */
export class Graph {
    private persistentStore: any;
    private validationStore: any;
    private rdfLibStore: any;
    private prefixes: {};

    /**
     * Create a new Graph.
     */
    public constructor() {
        let N3 = require("n3");
        let $rdf = require('rdflib');

        this.persistentStore = N3.Store();
        this.validationStore = new IndexedFormula();
        this.rdfLibStore = $rdf.graph();
        this.prefixes = {};
    }

    /**
     * Retrieve the representation of the Graph used for persistence.
     * @returns {any}
     */
    public getPersistentStore() {
        return this.persistentStore;
    }

    /**
     * Retrieve the representation of the Graph used for validation.
     * @returns {any}
     */
    public getValidationStore() {
        return this.validationStore;
    }

    /**
     * Retrieve the representation of the Graph used in rdflib
     * @returns {any}
     */
    public getRdfLibStore() {
        return this.rdfLibStore;
    }

    /**
     * Add a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string) {
        this.persistentStore.addTriple(subject, predicate, object);
        this.validationStore.add(new Statement(subject, predicate, object, this.validationStore));
    }

    /**
     * Remove a triple from the Graph.
     * @param {string} subject
     * @param {string} predicate
     * @param {string} object
     */
    public removeTriple(subject: string, predicate: string, object: string) {
        this.persistentStore.removeTriple(subject, predicate, object);
        this.validationStore.remove(new Statement(subject, predicate, object));
    }

    /**
     * Add multiple triples to the Graph.
     * @param triples
     */
    public addTriples(triples: Array<any>) {
        this.persistentStore.addTriples(triples);
        triples.forEach(t => {
            this.validationStore.add(new Statement(t.subject, t.predicate, t.object, this.validationStore));
        });
    }

    /**
     * Remove multiple triples from the Graph.
     * @param {Array<any>} triples
     */
    public removeTriples(triples: Array<any>) {
        this.persistentStore.removeTriples(triples);
        triples.forEach(t => {
            this.validationStore.remove(new Statement(t.subject, t.predicate, t.object));
        });
    }

    /**
     * Retrieve all the prefixes in this Graph.
     * @returns {any}
     */
    public getPrefixes() {
        return this.prefixes;
    }

    /**
     * Add a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string) {
        this.persistentStore.addPrefix(prefix, iri);
        this.prefixes[prefix] = iri;
    }

    /**
     * Add multiple presfixes to this Graph.
     * @param prefixes
     */
    public addPrefixes(prefixes: {}) {
        this.persistentStore.addPrefixes(prefixes);
        Object.keys(prefixes).forEach(k => {
            this.prefixes[k] = prefixes[k];
        });
    }

    /**
     * Merges this graph with another graph.
     * @param {Graph} other
     */
    public merge(other: Graph) {
        this.addPrefixes(other.getPrefixes());
        this.persistentStore.addTriples(other.persistentStore.getTriples());
        this.validationStore.addAll(other.validationStore.match());
    }
}