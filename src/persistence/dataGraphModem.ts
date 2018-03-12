/// <reference path="./modem.d.ts"/>

import * as Collections from "typescript-collections";
import {ModelComponent} from "../entities/model";

export class DataGraphModem implements Modem {

    private graph: any;

    private label: ModelComponent;
    private mimeTypes: Collections.Set<string>;

    public constructor() {
        let rdf = require("shacl-js/rdflib-graph");
        this.graph = new rdf.RDFLibGraph(null);

        this.label = ModelComponent.DataGraph;
        this.mimeTypes = new Collections.Set<string>();
        this.mimeTypes.add("text/n3");
        this.mimeTypes.add("application/rdf+xml");
        this.mimeTypes.add("text/turtle");
    }

    public getLabel() {
        return this.label;
    }

    public modulate(data: any, mime: string) {
        if (this.mimeTypes.contains(mime)) {
            // get an RDFLibGraphIterator that is able to iterate over the entire store
            let iterator = data.find(undefined, undefined, undefined);
            let content = [];
            let el;
            while (el = iterator.next()) {
                content.push(el.subject + " " + el.predicate + " " + el.object);
            }

            return content.join("");
        }

        throw new Error("Incorrect MimeType " + mime + "!");
    }

    /**
     * Parse a string from some RDF format (supported types are Turtle, RDF/XML, N3).
     * Return a graph structure (set of parsed RDF triples).
     */
    public demodulate(content: string, mime: string) {
        if (this.mimeTypes.contains(mime)) {
            this.graph.loadGraph(content, null, mime, null, null);
        }

        throw new Error("Incorrect MimeType " + mime + "!");
    }

    public getData() {
        return this.graph;
    }

    public clean() {
        this.graph.clear();
    }
}