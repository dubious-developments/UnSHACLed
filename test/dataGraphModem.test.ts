import {DataGraphModem} from "../src/persistence/dataGraphModem";

describe("DataGraphModem Class", () => {
    it("Should parse valid Turtle code and return a graph " +
        "containing the (expanded) triples described therein.",
       () => {
            let modem = new DataGraphModem();
            let graph = modem.demodulate(generateTurtle(), "text/turtle");
            expect(modem.getData()).toEqual(graph);
            expect(graph.countTriples()).toEqual(2);

            let firstTriple = graph.getTriples()[0];
            expect(firstTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(firstTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/publisher");
            expect(firstTriple.object).toEqual('"Wikipedia"');

            let secondTriple = graph.getTriples()[1];
            expect(secondTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(secondTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(secondTriple.object).toEqual('"Tony Benn"');

            modem.clean();
            expect(modem.getData().countTriples()).toEqual(0);
       });

    it("Should translate a graph to a string containing valid Turtle code.",
       () => {

        });

    it("Should throw an error when passed an unsupported MIME type.",
       () => {
            let modem = new DataGraphModem();
            expect(() => modem.demodulate(generateTurtle(), "application/rdf+xml"))
                .toThrow(Error("Incorrect MimeType application/rdf+xml!"));

            expect(() => modem.modulate(null, "application/rdf+xml"))
               .toThrow(Error("Incorrect MimeType application/rdf+xml!"));
        });
});

function generateTurtle() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}
