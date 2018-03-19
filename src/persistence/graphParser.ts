/// <reference path="./parser.d.ts"/>

import * as Collections from "typescript-collections";
import {Graph} from "./graph";

/**
 * A Parser that takes care of (de)modulation for data graphs.
 */
export class GraphParser implements Parser {

    private graph: Graph;

    private mimeTypes: Collections.Set<string>;

    /**
     * Create a new GraphParser.
     */
    public constructor() {
        this.clean();

        this.mimeTypes = new Collections.Set<string>();
        this.mimeTypes.add("application/n-quads");
        this.mimeTypes.add("application/n-triples");
        this.mimeTypes.add("application/trig");
        this.mimeTypes.add("text/turtle");
    }

    /**
     * Asynchronously serialize a graph of triples to a string containing
     * representational RDF code in some format.
     * @param data
     * @param {string} mime
     * @param andThen
     * @returns {string}
     */
    public serialize(data: any, mime: string, andThen: (result: string) => void) {
        if (this.mimeTypes.contains(mime)) {
            let N3 = require("n3");
            let writer = N3.Writer();

            let graph: Graph = data;
            writer.addPrefixes(graph.getPrefixes());
            writer.addTriples(graph.getPersistentStore().getTriples());
            writer.end(function (error: any, result: any) {
                andThen(result);
            });
        } else {
            throw new Error("Incorrect MimeType " + mime + "!");
        }
    }

    /**
     * Asynchronously parse a string of RDF code in some format.
     * Return a graph structure (set of parsed RDF triples).
     * @param {string} content
     * @param {string} mime
     * @param andThen
     * @returns {any}
     */
    public parse(content: string, mime: string, andThen: (result: any) => void) {
        if (this.mimeTypes.contains(mime)) {
            let N3 = require("n3");
            let parser = N3.Parser({ format: mime });

            let self = this;
            parser.parse(content,
                         function(error: any, triple: any, prefixes: any) {
                             if (triple) {
                                 self.graph.addTriple(triple.subject, triple.predicate, triple.object);
                             } else {
                                 if (prefixes) {
                                     self.graph.addPrefixes(prefixes);
                                 }
                                 andThen(self.graph);
                             }
                 });
        } else {
            throw new Error("Incorrect MimeType " + mime + "!");
        }
    }

    /**
     * Retrieve the data contained by this GraphParser.
     * @returns {any}
     */
    public getData() {
        return this.graph;
    }

    /**
     * Clean whatever is contained by this GraphParser.
     */
    public clean() {
        this.graph = new Graph();
    }
}