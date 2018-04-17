import * as Collections from "typescript-collections";
import $rdf from "rdflib";
import {Statement} from "rdflib";

/**
 * Return the string representation of a triple.
 * @param triple
 * @returns {string}
 */
function tripleToString(triple: any): string {
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

/**
 * A wrapper class for library-specific triple stores.
 */
export class Graph {

    private N3Store: any;
    private SHACLStore: any;
    private prefixes: {};

    private changes: Collections.Dictionary<ChangeSet, Collections.Set<any>>;

    /**
     * Create a new Graph.
     */
    public constructor() {
        let N3 = require("n3");
        this.N3Store = N3.Store();
        this.SHACLStore = $rdf.graph();

        this.changes = new Collections.Dictionary<ChangeSet, Collections.Set<any>>();

        this.changes.setValue(ChangeSet.ADD, new Collections.Set<any>(tripleToString));
        this.changes.setValue(ChangeSet.REMOVE, new Collections.Set<any>(tripleToString));

        this.prefixes = {};
    }

    /**
     * Retrieve the N3 store contained within this graph structure.
     * @returns {any}
     */
    public getN3Store(): any {
        return this.N3Store;
    }

    /**
     * Retrieve the SHACL store contained within this graph structure.
     * @returns {any}
     */
    public getSHACLStore(): any {
        return this.SHACLStore;
    }

    /**
     * Retrieve recent changes made to the graph structure.
     * @returns {Set<any>}
     */
    public getChanges(): Collections.Dictionary<ChangeSet, Collections.Set<any>> {
        return this.changes;
    }

    /**
     * Clear all changes.
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
        this.changes.values().forEach(function (s: Collections.Set<any>) {
            changed = changed || !s.isEmpty();
        });

        return changed;
    }

    /**
     * Add a triple to the Graph.
     * @param subject
     * @param predicate
     * @param object
     */
    public addTriple(subject: string, predicate: string, object: string): void {
        this.N3Store.addTriple(subject, predicate, object);
        this.SHACLStore.add(new Statement(subject, predicate, object, this.SHACLStore));
        this.updateChanges(ChangeSet.ADD, ChangeSet.REMOVE, subject, predicate, object);
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
        this.updateChanges(ChangeSet.REMOVE, ChangeSet.ADD, subject, predicate, object);
    }

    /**
     * Add multiple triples to the Graph.
     * @param triples
     */
    public addTriples(triples: Array<any>): void {
        this.N3Store.addTriples(triples);
        triples.forEach(t => {
            this.SHACLStore.add(new Statement(t.subject, t.predicate, t.object, this.SHACLStore));
            this.updateChanges(ChangeSet.ADD, ChangeSet.REMOVE, t.subject, t.predicate, t.object);
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
            this.updateChanges(ChangeSet.REMOVE, ChangeSet.ADD, t.subject, t.predicate, t.object);
        });
    }

    /**
     * Updates the fields of the original triple with the corresponding new values.
     * If one of the new value fields is omitted, the original value for that field is maintained.
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
        this.removeTriple(oSubject, oPredicate, oObject);
        this.addTriple(nSubject, nPredicate, nObject);
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
        // do merge of prefixes
        this.addPrefixes(other.getPrefixes());

        // do merge of stores.
        this.N3Store.addTriples(other.N3Store.getTriples());
        this.SHACLStore.addAll(other.SHACLStore.match());

        // do merge of change sets
        let theseChanges = this.changes.getValue(ChangeSet.ADD);
        if (theseChanges) {
            let otherChanges = other.changes.getValue(ChangeSet.ADD);
            if (otherChanges) {
                theseChanges.union(otherChanges);
            }
        }

        theseChanges = this.changes.getValue(ChangeSet.REMOVE);
        if (theseChanges) {
            let otherChanges = other.changes.getValue(ChangeSet.REMOVE);
            if (otherChanges) {
                theseChanges.union(otherChanges);
            }
        }
    }

    /**
     * Update changes.
     * @param focus
     * @param other
     * @param {string} subject
     * @param {string} predicate
     * @param {string} object
     */
    private updateChanges(focus: ChangeSet, other: ChangeSet,
                          subject: string, predicate: string, object: string): void {
        let focusSet = this.changes.getValue(focus);
        let otherSet = this.changes.getValue(other);
        if (focusSet) {
            // add change to the relevant set
            // makes use of the shacl.js representation
            focusSet.add({subject: subject, predicate: predicate, object: object});
            if (otherSet) {
                // performs a bidirectional difference operation:
                // we do this to avoid the situation where e.g. if a previously added triple is removed
                // the changes would still reflect that it was both added and removed;
                // this gives a false impression of change, because in fact the graph hasn't altered at all
                let backup = new Collections.Set<any>();
                backup.union(focusSet);
                focusSet.difference(otherSet);
                otherSet.difference(backup);
            }
        }
    }
}