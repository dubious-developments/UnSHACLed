export class DataGraphModem implements Modem {

    private data: any;

    public modulate(data: any) {
        return "";
    }

    /**
     * Parse a string from some RDF format (supported types are Turtle, RDF/XML, N3).
     * Return a graph structure (set of parsed RDF triples).
     */
    public demodulate(content: string) {
        let SHACL = require("../../conformance/shacl");
        let validator = new SHACL.SHACLValidator();
        // accumulate data here.
    }

    public getData() {
        return this.data;
    }

    public clean() {
        this.data = null;
    }
}