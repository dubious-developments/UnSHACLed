import * as Collections from "typescript-collections";
import $rdf from "rdflib";
import { Statement } from "rdflib";
import { TimeCapsule } from "../entities/timeCapsule";

type Triple = { subject: string, predicate: string, object: string };

export type PrefixMap = { [prefix: string]: string };

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
     * Checks if the graph contains a particular triple.
     */
    public containsTriple(subject: string, predicate: string, object: string): boolean {
        return this.immutableVersion.containsTriple(subject, predicate, object);
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
     * Updates the fields of the original triple with the corresponding new values.
     * If one of the new value fields is omitted, the original value for that field is maintained.
     * Returns the updated graph.
     * @param {string} oSubject
     * @param {string} oPredicate
     * @param {string} oObject
     * @param {string} nSubject
     * @param {string} nPredicate
     * @param {string} nObject
     */
    public updateTriple(oSubject: string, oPredicate: string, oObject: string,
                        {nSubject = oSubject, nPredicate = oPredicate, nObject = oObject}:
                            {nSubject?: string, nPredicate?: string, nObject?: string}) {
        this.immutableVersion = this.immutableVersion
            .updateTriple(oSubject, oPredicate, oObject,
                          {nSubject: nSubject, nPredicate: nPredicate, nObject: nObject});
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

    /**
     * Retrieve recent additions.
     */
    public getLatestAdditions(): Collections.Set<Triple> {
        return this.immutableVersion.getLatestAdditions();
    }

    /**
     * Retrieve recent removals.
     */
    public getLatestRemovals(): Collections.Set<Triple> {
        return this.immutableVersion.getLatestRemovals();
    }

    /**
     * Clear recent change history.
     */
    public clearRecentChanges(): void {
        this.immutableVersion = this.immutableVersion.clearRecentChanges();
    }

    /**
     * Check whether the graph has recently been changed.
     * @returns {boolean}
     */
    public hasRecentlyChanged(): boolean {
        return this.immutableVersion.hasRecentlyChanged();
    }

    /**
     * Perform a merge operation based on the other graph's recent changes.
     * @param {Graph} other
     */
    public incrementalMerge(other: Graph) {
        this.immutableVersion = this.immutableVersion.incrementalMerge(other.immutableVersion);
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
     * Checks if the graph contains a particular triple.
     */
    public containsTriple(subject: string, predicate: string, object: string): boolean {
        return this.capsule.query(data => data.containsTriple(subject, predicate, object));
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
     * Updates the fields of the original triple with the corresponding new values.
     * If one of the new value fields is omitted, the original value for that field is maintained.
     * Returns the updated graph.
     * @param {string} oSubject
     * @param {string} oPredicate
     * @param {string} oObject
     * @param {string} nSubject
     * @param {string} nPredicate
     * @param {string} nObject
     */
    public updateTriple(oSubject: string, oPredicate: string, oObject: string,
                        {nSubject = oSubject, nPredicate = oPredicate, nObject = oObject}:
                            {nSubject?: string, nPredicate?: string, nObject?: string}): ImmutableGraph {
        return this.removeTriple(oSubject, oPredicate, oObject).addTriple(nSubject, nPredicate, nObject);
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

    /**
     * Retrieve recent additions.
     */
    public getLatestAdditions(): Collections.Set<Triple> {
        return this.capsule.query(data => data.getAdditions());
    }

    /**
     * Retrieve recent removals.
     */
    public getLatestRemovals(): Collections.Set<Triple> {
        return this.capsule.query(data => data.getRemovals());
    }

    /**
     * Clear recent change history.
     */
    public clearRecentChanges(): ImmutableGraph {
        let additions = new Collections.Set(tripleToString);
        this.getLatestAdditions().forEach(a => additions.add(a));
        let removals = new Collections.Set(tripleToString);
        this.getLatestRemovals().forEach(r => removals.add(r));
        return new ImmutableGraph(
            this.capsule.modify(
                data => data.clearChanges()
                ,
                data => {
                    additions.forEach(a =>
                        data.updateChanges(ChangeSet.ADD, ChangeSet.REMOVE, a.subject, a.predicate, a.object));
                    removals.forEach(r =>
                        data.updateChanges(ChangeSet.REMOVE, ChangeSet.ADD, r.subject, r.predicate, r.object));
                }
            )
        );
    }

    /**
     * Check whether the graph has recently been changed (counter-intuitive, I know).
     * @returns {boolean}
     */
    public hasRecentlyChanged(): boolean {
        return this.capsule.query(data => data.hasChanged());
    }

    /**
     * Perform a merge operation based on the other graph's recent changes.
     * @param {Graph} other
     */
    public incrementalMerge(other: ImmutableGraph): ImmutableGraph {
        let prefixes = other.getPrefixes();
        let additions = other.getLatestAdditions();
        let removals = other.getLatestRemovals();
        return new ImmutableGraph(
            this.capsule.modify(
                data => data.doMerge(prefixes, additions, removals),
                data => data.undoMerge(prefixes, additions, removals)));
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

    /**
     * Recent changes to this graph.
     */
    private changes: Collections.Dictionary<ChangeSet, Collections.Set<Triple>>;

    private prefixes: PrefixMap;

    public constructor() {
        let N3 = require("n3");
        this.n3Store = N3.Store();
        this.store = $rdf.graph();

        this.changes = new Collections.Dictionary<ChangeSet, Collections.Set<Triple>>();

        this.changes.setValue(ChangeSet.ADD, new Collections.Set<Triple>(tripleToString));
        this.changes.setValue(ChangeSet.REMOVE, new Collections.Set<Triple>(tripleToString));

        this.prefixes = {};
    }

    /**
     * Checks if the graph contains a particular triple.
     */
    public containsTriple(subject: string, predicate: string, object: string): boolean {
        return this.store.match(subject, predicate, object).length > 0;
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
        this.updateChanges(ChangeSet.ADD, ChangeSet.REMOVE, subject, predicate, object);
    }

    /**
     * Remove a triple from the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public removeTriple(subject: string, predicate: string, object: string) {
        this.n3Store.removeTriple(subject, predicate, object);
        this.store.remove(subject, predicate, object);
        this.updateChanges(ChangeSet.REMOVE, ChangeSet.ADD, subject, predicate, object);
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

    /**
     * Perform a merge operation based on the other graph's recent changes.
     * Also performs a transferal of recent changes, so that the other graph's changes are
     * effectively consumed.
     * @param prefixes
     * @param additions
     * @param removals
     */
    public doMerge(prefixes: PrefixMap,
                   additions: Collections.Set<Triple>, removals: Collections.Set<Triple>): void {
        // do merge of prefixes
        Object.keys(prefixes).forEach(k => {
            this.addPrefix(k, prefixes[k]);
        });

        // do merge based on change sets
        additions.toArray().forEach(t => {
            this.addTriple(t.subject, t.predicate, t.object);
        });

        removals.toArray().forEach(t => {
            if (this.containsTriple(t.subject, t.predicate, t.object)) {
                this.removeTriple(t.subject, t.predicate, t.object);
            }
        });
    }

    /**
     * Undo a recent merge operation with another graph.
     * @param prefixes
     * @param additions
     * @param removals
     */
    public undoMerge(prefixes: PrefixMap,
                     additions: Collections.Set<Triple>, removals: Collections.Set<Triple>): void {
        // undo merge of prefixes
        Object.keys(prefixes).forEach(k => {
            this.removePrefix(k);
        });

        // undo merge based on change sets
        additions.toArray().forEach(t => {
            if (this.containsTriple(t.subject, t.predicate, t.object)) {
                this.removeTriple(t.subject, t.predicate, t.object);
            }
        });

        removals.toArray().forEach(t => {
            this.addTriple(t.subject, t.predicate, t.object);
        });
    }

    /**
     * Retrieve additions.
     */
    public getAdditions(): Collections.Set<Triple> {
        let additions = this.changes.getValue(ChangeSet.ADD);
        if (additions) {
            return additions;
        } else {
            return new Collections.Set<Triple>();
        }
    }

    /**
     * Retrieve removals.
     */
    public getRemovals(): Collections.Set<Triple> {
        let removals = this.changes.getValue(ChangeSet.REMOVE);
        if (removals) {
            return removals;
        } else {
            return new Collections.Set<Triple>();
        }    }

    /**
     * Clear change history.
     */
    public clearChanges(): void {
        this.changes.values().forEach(s => s.clear());
    }

    /**
     * Check whether the graph has recently changed.
     * @returns {boolean}
     */
    public hasChanged(): boolean {
        let changed = false;
        this.changes.values().forEach(function (s: Collections.Set<Triple>) {
            changed = changed || !s.isEmpty();
        });

        return changed;
    }

    /**
     * Update changes.
     * @param focus
     * @param other
     * @param {string} subject
     * @param {string} predicate
     * @param {string} object
     */
    public updateChanges(focus: ChangeSet, other: ChangeSet,
                         subject: string, predicate: string, object: string): void {
        let focusSet = this.changes.getValue(focus);
        let otherSet = this.changes.getValue(other);
        if (focusSet) {
            // add change to the relevant set
            focusSet.add({subject: subject, predicate: predicate, object: object});
            if (otherSet) {
                // performs a bidirectional difference operation:
                // we do this to avoid the situation where e.g. if a previously added triple is removed
                // the changes would still reflect that it was both added and removed;
                // this gives a false impression of change, because in fact the graph hasn't altered at all
                let backup = new Collections.Set<Triple>();
                backup.union(focusSet);
                focusSet.difference(otherSet);
                // console.log(focusSet.toString());
                otherSet.difference(backup);
                // console.log(otherSet.toString());
            }
        }
    }
}

/**
 * Return the string representation of a triple.
 * @param triple
 * @returns {string}
 */
function tripleToString(triple: Triple): string {
    return triple.object + ", " + triple.predicate + ", " + triple.object;
}

/**
 * The different types of changes to a graph structure.
 */
export enum ChangeSet {
    /**
     * When triples are added to the graph structure.
     */
    ADD,

    /**
     * When triples are removed from the graph structure.
     */
    REMOVE
}
