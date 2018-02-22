import {$rdf} from "rdflib";

export class Parser {
    // contains mappings from extension to internet media type
    private formats: Map<string, string>;
    public constructor() {
        this.formats = new Map();
        this.formats.set("n3", "text/n3");
        this.formats.set("rdf", "application/rdf+xml");
        this.formats.set("ttl", "text/turtle");
    }

    /**
     * Parse a URI using the rdflib library; return a graph structure upon success.
     * @param {Uri} uri
     */
    public parse(uri: Uri) {
        let splitUri: string[] = uri.getUriAsString().split(".");
        let ext: string = splitUri[splitUri.length.valueOf() - 1];
        let body = "<s> <p> <o> .";
        let mimeType: string = this.formats.get(ext);
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
