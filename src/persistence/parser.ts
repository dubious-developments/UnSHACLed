export class Parser {

    private store: any;

    public constructor() {
        this.prepare();
    }

    /**
     * Parse a string in some RDF format (supported types are Turtle, TriG, N-Triples, N-Quads).
     * Return a graph structure (set of parsed RDF triples).
     */
    public parse(content: string) {
        let N3 = require("n3");
        let parser = N3.Parser();
        let store = this.store;
        parser.parse(content,
                     function(error: any, triple: any, prefixes: any) {
                        if (triple) {
                            store.addTriple(triple.subject, triple.predicate, triple.object);
                        } else {
                            store.addPrefixes(prefixes);
                        }
            });
    }

    public prepare() {
        let N3 = require("n3");
        this.store = N3.Store();
    }

    public getStore() {
        return this.store;
    }
}
