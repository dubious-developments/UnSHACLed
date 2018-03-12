/// <reference path="./modem.d.ts"/>

import * as Collections from "typescript-collections";
import {ModelComponent} from "../entities/model";

export class DataGraphModem implements Modem {

    private graph: any;

    private label: ModelComponent;
    private mimeTypes: Collections.Set<string>;

    public constructor() {
        this.clean();

        this.label = ModelComponent.DataGraph;
        this.mimeTypes = new Collections.Set<string>();
        this.mimeTypes.add("application/n-quads");
        this.mimeTypes.add("application/n-triples");
        this.mimeTypes.add("application/trig");
        this.mimeTypes.add("text/turtle");
    }

    public getLabel() {
        return this.label;
    }

    public modulate(data: any, mime: string) {
        if (this.mimeTypes.contains(mime)) {
            return "";
        }

        throw new Error("Incorrect MimeType " + mime + "!");
    }

    /**
     * Synchronously parse a string from some RDF format.
     * Return a graph structure (set of parsed RDF triples).
     */
    public demodulate(content: string, mime: string) {
        if (this.mimeTypes.contains(mime)) {
            let N3 = require("n3");
            let parser = N3.Parser({ format: mime });
            this.graph.addTriples(parser.parse(content));

            return this.graph;
        }

        throw new Error("Incorrect MimeType " + mime + "!");
    }

    public getData() {
        return this.graph;
    }

    public clean() {
        let N3 = require("n3");
        this.graph = N3.Store();
    }
}