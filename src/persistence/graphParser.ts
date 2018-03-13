/// <reference path="./parser.d.ts"/>

import * as Collections from "typescript-collections";
import {ModelComponent} from "../entities/model";

/**
 * A Modem that takes care of (de)modulation for data graphs.
 */
export class GraphParser implements Parser {

    // sometime in the near future, this will probably
    // become a dedicated type with its own wrapper functions
    private graph: any;

    private label: ModelComponent;
    private mimeTypes: Collections.Set<string>;

    /**
     * Create a new DataGraphModem.
     */
    public constructor() {
        this.clean();

        this.label = ModelComponent.DataGraph;
        this.mimeTypes = new Collections.Set<string>();
        this.mimeTypes.add("application/n-quads");
        this.mimeTypes.add("application/n-triples");
        this.mimeTypes.add("application/trig");
        this.mimeTypes.add("text/turtle");
    }

    /**
     * Retrieve the label for this DataGraphModem.
     * @returns {ModelComponent}
     */
    public getLabel() {
        return this.label;
    }

    /**
     * Convert a graph of triples to a string containing
     * representational RDF code in some format.
     * @param data
     * @param {string} mime
     * @returns {string}
     */
    public serialize(data: any, mime: string) {
        if (this.mimeTypes.contains(mime)) {
            return "";
        }

        throw new Error("Incorrect MimeType " + mime + "!");
    }

    /**
     * Synchronously parse a string of RDF code in some format.
     * Return a graph structure (set of parsed RDF triples).
     * @param {string} content
     * @param {string} mime
     * @returns {any}
     */
    public parse(content: string, mime: string) {
        if (this.mimeTypes.contains(mime)) {
            let N3 = require("n3");
            let parser = N3.Parser({ format: mime });
            // N3 library does not (or so it appears) allow us to
            // parse prefixes synchronously, which does not have a
            // direct impact on the graph (the triples are expanded anyway)
            // but does hamper our ability to offer bijective persistence
            this.graph.addTriples(parser.parse(content));

            return this.graph;
        }

        throw new Error("Incorrect MimeType " + mime + "!");
    }

    /**
     * Retrieve the data contained by this Modem.
     * @returns {any}
     */
    public getData() {
        return this.graph;
    }

    /**
     * Clean whatever is contained by this Modem.
     */
    public clean() {
        let N3 = require("n3");
        this.graph = N3.Store();
    }
}