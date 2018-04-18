import { IndexedFormula, Statement } from "rdflib";
import { TimeCapsule } from "../entities/timeCapsule";

type Triple = { subject: string, predicate: string, object: string };

type PrefixMap = { [prefix: string]: string };

/**
 * A mutable wrapper for library-specific triple stores.
 */
export class Graph {
    private immutableVersion: ImmutableGraph;

    /**
     * Creates a new graph.
     * @param immutableGraph An immutable graph to base the mutable graph on.
     */
    public constructor(immutableGraph?: ImmutableGraph) {

        if (immutableGraph) {
            this.immutableVersion = immutableGraph;
        } else {
            this.immutableVersion = ImmutableGraph.create();
        }
    }

    /**
     * Returns an immutable version of this graph.
     */
    public asImmutable(): ImmutableGraph {
        return this.immutableVersion;
    }

    /**
     * Runs a function on the N3 graph store.
     * NOTE: the function is not allowed to modify
     * the N3 store.
     * @param func The function to apply.
     */
    public queryN3Store<T>(func: (store: any) => T): T {
        // TODO: delete this hack.
        return this.immutableVersion.queryN3Store<T>(func);
    }

    /**
     * Runs a function on the graph store.
     * NOTE: the function is not allowed to modify
     * the graph store.
     * @param func The function to apply.
     */
    public query<T>(func: (store: any) => T): T {
        return this.immutableVersion.query<T>(func);
    }

    /**
     * Adds a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string) {
        this.immutableVersion = this.immutableVersion.addTriple(
            subject,
            predicate,
            object);
    }

    /**
     * Checks if the graph contains a particular triple.
     */
    public containsTriple(subject: string, predicate: string, object: string): boolean {

        return this.immutableVersion.containsTriple(subject, predicate, object);
    }

    /**
     * Removes a triple from the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public removeTriple(subject: string, predicate: string, object: string) {
        this.immutableVersion = this.immutableVersion.removeTriple(
            subject,
            predicate,
            object);
    }

    /**
     * Adds multiple triples to the Graph.
     * @param triples The triples to add.
     */
    public addTriples(triples: Triple[]) {
        this.immutableVersion = this.immutableVersion.addTriples(triples);
    }

    /**
     * Removes multiple triples from the Graph.
     * @param triples The triples to remove.
     */
    public removeTriples(triples: Triple[]) {
        this.immutableVersion = this.immutableVersion.removeTriples(triples);
    }

    /**
     * Retrieves all the prefixes in this Graph.
     */
    public getPrefixes(): PrefixMap {
        return this.immutableVersion.getPrefixes();
    }

    /**
     * Adds a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string) {
        this.immutableVersion = this.immutableVersion.addPrefix(prefix, iri);
    }

    /**
     * Adds multiple prefixes to this Graph.
     * @param prefixes
     */
    public addPrefixes(prefixes: PrefixMap) {
        this.immutableVersion = this.immutableVersion.addPrefixes(prefixes);
    }
}

/**
 * An immutable wrapper for library-specific triple stores.
 */
export class ImmutableGraph {
    /**
     * Creates a new immutable graph.
     */
    private constructor(private capsule: TimeCapsule<GraphData>) {

    }

    /**
     * Creates a new immutable graph data structure.
     */
    public static create(): ImmutableGraph {

        return new ImmutableGraph(TimeCapsule.create<GraphData>(new GraphData()));
    }

    /**
     * Creates a mutable copy of this immutable graph.
     */
    public toMutable(): Graph {
        return new Graph(this);
    }

    /**
     * Runs a function on the N3 graph store.
     * NOTE: the function is not allowed to modify
     * the N3 store.
     * @param func The function to apply.
     */
    public queryN3Store<T>(func: (store: any) => T): T {

        // TODO: delete this hack.
        return this.capsule.query<T>(data => func(data.n3Store));
    }

    /**
     * Runs a function on the graph store.
     * NOTE: the function is not allowed to modify
     * the graph store.
     * @param func The function to apply.
     */
    public query<T>(func: (store: any) => T): T {

        return this.capsule.query<T>(data => func(data.store));
    }

    /**
     * Adds a triple to the graph. Returns a new graph that
     * contains the triple.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string): ImmutableGraph {

        if (this.containsTriple(subject, predicate, object)) {

            return this;
        } else {

            return new ImmutableGraph(
                this.capsule.modify(
                    data => data.addTriple(subject, predicate, object),
                    data => data.removeTriple(subject, predicate, object)));
        }
    }

    /**
     * Checks if the graph contains a particular triple.
     */
    public containsTriple(subject: string, predicate: string, object: string): boolean {

        return this.capsule.query(data => data.containsTriple(subject, predicate, object));
    }

    /**
     * Removes a triple from the graph. Returns the updated graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public removeTriple(subject: string, predicate: string, object: string): ImmutableGraph {

        if (this.containsTriple(subject, predicate, object)) {

            return new ImmutableGraph(
                this.capsule.modify(
                    data => data.removeTriple(subject, predicate, object),
                    data => data.addTriple(subject, predicate, object)));
        } else {

            return this;
        }
    }

    /**
     * Adds multiple triples to the graph. Returns the updated graph.
     * @param triples The triples to add.
     */
    public addTriples(triples: Triple[]): ImmutableGraph {

        // TODO: maybe add the triples in batches?
        let result: ImmutableGraph = this;
        for (let triple of triples) {

            result = result.addTriple(
                triple.subject,
                triple.predicate,
                triple.object);
        }
        return result;
    }

    /**
     * Removes multiple triples from the graph. Returns the updated graph.
     * @param triples The triples to remove.
     */
    public removeTriples(triples: Triple[]): ImmutableGraph {

        // TODO: maybe remove the triples in batches?
        let result: ImmutableGraph = this;
        for (let triple of triples) {

            result = result.removeTriple(
                triple.subject,
                triple.predicate,
                triple.object);
        }
        return result;
    }

    /**
     * Retrieves all the prefixes in this graph.
     */
    public getPrefixes(): PrefixMap {

        return this.capsule.query(data => data.getPrefixes());
    }

    /**
     * Adds a prefix to this graph. Returns the updated graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string): ImmutableGraph {

        let currentPrefixes = this.getPrefixes();
        if (prefix in currentPrefixes) {

            let oldIri = currentPrefixes[prefix];
            return new ImmutableGraph(
                this.capsule.modify(
                    data => data.addPrefix(prefix, iri),
                    data => data.addPrefix(prefix, oldIri)));
        } else {

            return new ImmutableGraph(
                this.capsule.modify(
                    data => data.addPrefix(prefix, iri),
                    data => data.removePrefix(prefix)));
        }
    }

    /**
     * Adds multiple prefixes to this graph. Returns the updated graph.
     * @param prefixes
     */
    public addPrefixes(prefixes: PrefixMap): ImmutableGraph {

        // TODO: maybe add the prefixes in batches?
        let result: ImmutableGraph = this;
        for (let key in prefixes) {
            result = result.addPrefix(key, prefixes[key]);
        }
        return result;
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

    private prefixes: PrefixMap;

    public constructor() {
        let N3 = require("n3");
        this.n3Store = N3.Store();
        this.store = new IndexedFormula();
        this.prefixes = {};
    }

    /**
     * Adds a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string) {
        this.n3Store.addTriple(subject, predicate, object);
        this.store.add(new Statement(subject, predicate, object, this.store));
    }

    /**
     * Checks if the graph contains a particular triple.
     */
    public containsTriple(subject: string, predicate: string, object: string): boolean {
        return this.store.match(subject, predicate, object).length > 0;
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
     * Retrieves all the prefixes in this Graph.
     */
    public getPrefixes(): PrefixMap {
        return this.prefixes;
    }

    /**
     * Adds a prefix to this Graph.
     * @param prefix
     * @param iri
     */
    public addPrefix(prefix: string, iri: string) {
        this.n3Store.addPrefix(prefix, iri);
        this.prefixes[prefix] = iri;
    }

    /**
     * Removes a prefix from this graph.
     * @param prefix The prefix to remove.
     */
    public removePrefix(prefix: string): any {
        delete this.n3Store._prefixes[prefix];
        delete this.prefixes[prefix];
    }
}
