import SHACLValidator from "../src/conformance/shacl";
import {Statement} from "rdflib";
import {Graph} from "../src/persistence/graph";
import {GraphParser} from "../src/persistence/graphParser";

describe("Graph Class", () => {
    it("should maintain a consistent store for persistence purposes.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a triple
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let triple = graph.getPersistentStore().getTriples()[0];
            expect(triple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(triple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(triple.object).toEqual('"Tony Benn"');

            // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            expect(graph.getPersistentStore().countTriples()).toEqual(0);

            // TEST CASE: adding multiple triples
            graph.addTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
                {
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
                }]);

            let firstTriple = graph.getPersistentStore().getTriples()[0];
            expect(firstTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(firstTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(firstTriple.object).toEqual('"Tony Benn"');

            let secondTriple = graph.getPersistentStore().getTriples()[1];
            expect(secondTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(secondTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/publisher");
            expect(secondTriple.object).toEqual('"Wikipedia"');

            // TEST CASE: removing multiple triples
            graph.removeTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
                {
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
                }]);

            expect(graph.getPersistentStore().countTriples()).toEqual(0);
        });

    it("should maintain a persistent store for validation purposes.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a triple
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            graph.query(store => {
                let statement = store.match()[0];
                let matchingStatement = new Statement(
                    "http://en.wikipedia.org/wiki/Tony_Benn",
                    "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                    store);
                expect(statement.equals(matchingStatement)).toEqual(true);
            });

            // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            expect(graph.query(store => store.length)).toEqual(0);

            // TEST CASE: adding multiple triples
            graph.addTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
            {
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
            }]);

            graph.query(store => {
                let firstStatement = store.match()[0];
                let firstMatchingStatement = new Statement(
                    "http://en.wikipedia.org/wiki/Tony_Benn",
                    "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                    store);
                expect(firstStatement.equals(firstMatchingStatement)).toEqual(true);
            });

            graph.query(store => {
                let secondStatement = store.match()[1];
                let secondMatchingStatement = new Statement(
                    "http://en.wikipedia.org/wiki/Tony_Benn",
                    "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"',
                    store);
                expect(secondStatement.equals(secondMatchingStatement)).toEqual(true);
            });

            // TEST CASE: removing multiple triples
            graph.removeTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
            {
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
            }]);

            expect(graph.query(store => store.length)).toEqual(0);
        });

    // TODO: This is not an actual test! To be removed when conformance tests are added.
    it("The validation store should be usable for validation.",
       (done) => {
            let parser = new GraphParser();
            parser.parse(getDataGraph(), "text/turtle", function (data: Graph) {
                parser.parse(getShapesGraph(), "text/turtle", function (shapes: Graph) {
                    data.query(dataStore => {
                        shapes.query(shapesStore => {
                            let validator = new SHACLValidator(dataStore, shapesStore);
                            validator.updateValidationEngine();
                            validator.showValidationResults(function (err: any, report: any) {
                                expect(report.conforms()).toEqual(true);
                                done();
                            });
                        });
                    });
                });
            });
        });

    it("should maintain a consistent prefix mapping.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a prefix
            let key = "dc";
            graph.addPrefix(key, "http://purl.org/dc/elements/1.1/");
            expect(graph.getPrefixes()[key]).toEqual("http://purl.org/dc/elements/1.1/");

            // TEST CASE: adding multiple prefixes
            graph.addPrefixes({
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                ex: "http://example.org/stuff/1.0/"
            });

            let firstKey = "rdf", secondKey = "ex";
            expect(graph.getPrefixes()[firstKey]).toEqual("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
            expect(graph.getPrefixes()[secondKey]).toEqual("http://example.org/stuff/1.0/");
        });

    it("should be able to merge with another graph.",
       () => {
            let graph = new Graph();
            let other = new Graph();

            graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            other.addPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
            other.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');

            graph.merge(other);

            expect(graph.getPersistentStore().countTriples()).toEqual(2);
            expect(graph.query(store => store.length)).toEqual(2);

            let key = "rdf";
            expect(graph.getPrefixes()[key]).toEqual("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
       });
});

function getDataGraph() {
    return 'ex:Alice' +
        'a ex:Person ;' +
        'ex:ssn "987-65-432A" .';
}

function getShapesGraph() {
    return 'ex:PersonShape ' +
        'a sh:NodeShape ;' +
        'sh:targetClass ex:Person ;' +
        'sh:property [' +
        'sh:path ex:ssn ;' +
        'sh:maxCount 1 ;' +
        'sh:datatype xsd:string ;' +
        'sh:pattern "^\\d{3}-\\d{2}-\\d{4}$" ;' +
        '] ;' +
        'sh:property [                 # _:b2' +
        'sh:path ex:worksFor ;' +
        'sh:class ex:Company ;' +
        'sh:nodeKind sh:IRI ;' +
        '] ;' +
        'sh:closed true ;' +
        'sh:ignoredProperties ( rdf:type ) .';
}