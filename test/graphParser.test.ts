import {GraphParser} from "../src/persistence/graphParser";
import {Graph} from "../src/persistence/graph";

describe("GraphParser Class", () => {
    it("should parse valid Turtle code and return a graph " +
        "containing the (expanded) triples described therein.",
       (done) => {
            let parser = new GraphParser();
            parser.parse(generateTurtle(), "text/turtle", function(result: any) {
                expect(result.getN3Store().countTriples()).toEqual(2);

                let firstTriple = result.getN3Store().getTriples()[0];
                expect(firstTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
                expect(firstTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
                expect(firstTriple.object).toEqual('"Tony Benn"');

                let secondTriple = result.getN3Store().getTriples()[1];
                expect(secondTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
                expect(secondTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/publisher");
                expect(secondTriple.object).toEqual('"Wikipedia"');

                parser.clean();
                expect(parser.getData().getN3Store().countTriples()).toEqual(0);
                done();
            });
       });

    it("should translate a graph to a string containing valid Turtle code.",
       (done) => {
            let parser = new GraphParser();
            let graph = new Graph();
            graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');
            parser.serialize(graph, "text/turtle", function(result: any) {
                let trimmedResult = result.replace(/\s+/g, "");
                let trimmedTarget = generateTurtle().replace(/\s+/g, "");
                expect(trimmedResult).toEqual(trimmedTarget);
                done();
            });
       });

    it("should throw an error when passed an unsupported MIME type.",
       () => {
            let parser = new GraphParser();
            expect(() => parser.parse(generateTurtle(), "application/rdf+xml", null))
                .toThrow(Error("Incorrect MimeType application/rdf+xml!"));

            expect(() => parser.serialize(null, "application/rdf+xml", null))
               .toThrow(Error("Incorrect MimeType application/rdf+xml!"));
        });
});

function generateTurtle() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}
