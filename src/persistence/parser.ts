import {Uri} from "./uri";

export class Parser {
    // contains mappings from extension to internet media type
    private formats: { [ext: string]: string; };
    public constructor() {
        let ext: string;
        this.formats = {};
        this.formats[ext = "n3"] = "text/n3";
        this.formats[ext = "rdf"] = "application/rdf+xml";
        this.formats[ext = "ttl"] = "text/turtle";
    }

    /**
     * Parse a file with the given URI using the rdflib library; return a graph structure upon success.
     * @param {Uri} uri
     */
    public parse(uri: Uri) {
        let $rdf = require("rdflib");
        let splitUri: string[] = uri.getUriAsString().split(".");
        let ext: string = splitUri[splitUri.length.valueOf() - 1];
        let body = "<s> <p> <o> .";
        let mimeType: string = this.formats[ext];
        let store = $rdf.graph();

        try {
            $rdf.parse(body, store, uri.getUriAsString(), mimeType);
            return store;
        } catch (err) {
            console.log(err);
        }
        return null;
    }
}
