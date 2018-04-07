import SHACLValidator from "../src/conformance/shacl";
import {Statement} from "rdflib";
import {ChangeSet, Graph} from "../src/persistence/graph";
import {GraphParser} from "../src/persistence/graphParser";

describe("Graph Class", () => {
    it("should maintain a consistent store for persistence purposes.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a triple
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let triple = graph.getN3Store().getTriples()[0];
            expect(triple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(triple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(triple.object).toEqual('"Tony Benn"');

            // TEST CASE: updating a triple
            graph.updateTriple(triple.subject, triple.predicate, triple.object,
                               {nObject: '"Someone else"'});

            let updatedTriple = graph.getN3Store().getTriples()[0];
            expect(updatedTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(updatedTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(updatedTriple.object).toEqual('"Someone else"');

            // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Someone else"');

            expect(graph.getN3Store().countTriples()).toEqual(0);

            // TEST CASE: adding multiple triples
            graph.addTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
                {
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
                }]);

            let firstTriple = graph.getN3Store().getTriples()[0];
            expect(firstTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(firstTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(firstTriple.object).toEqual('"Tony Benn"');

            let secondTriple = graph.getN3Store().getTriples()[1];
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

            expect(graph.getN3Store().countTriples()).toEqual(0);
        });

    it("should maintain a consistent store for validation purposes.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a triple
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let statement = graph.getSHACLStore().match()[0];
            let matchingStatement = new Statement("http://en.wikipedia.org/wiki/Tony_Benn",
                                                  "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                                                  graph.getSHACLStore());
            expect(statement.equals(matchingStatement)).toEqual(true);

            // TEST CASE: updating a triple
            graph.updateTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                               {nObject: '"Someone else"'});

            let updatedStatement = graph.getSHACLStore().match()[0];
            matchingStatement = new Statement("http://en.wikipedia.org/wiki/Tony_Benn",
                                              "http://purl.org/dc/elements/1.1/title", '"Someone else"',
                                              graph.getSHACLStore());
            expect(updatedStatement.equals(matchingStatement)).toEqual(true);

           // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Someone else"');

            expect(graph.getSHACLStore().length).toEqual(0);

            // TEST CASE: adding multiple triples
            graph.addTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
                {
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
                }]);

            let firstStatement = graph.getSHACLStore().match()[0];
            let firstMatchingStatement = new Statement("http://en.wikipedia.org/wiki/Tony_Benn",
                                                       "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                                                       graph.getSHACLStore());
            expect(firstStatement.equals(firstMatchingStatement)).toEqual(true);

            let secondStatement = graph.getSHACLStore().match()[1];
            let secondMatchingStatement = new Statement("http://en.wikipedia.org/wiki/Tony_Benn",
                                                        "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"',
                                                        graph.getSHACLStore());
            expect(secondStatement.equals(secondMatchingStatement)).toEqual(true);

            // TEST CASE: removing multiple triples
            graph.removeTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
                {
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
                }]);

            expect(graph.getSHACLStore().length).toEqual(0);

           // TEST CASE: updating a triple

       });

    // TODO: This is not an actual test! To be removed when conformance tests are added.
    it("The validation store should be usable for validation.",
       (done) => {
            let parser = new GraphParser();
            parser.parse(getDataGraph(), "text/turtle", function (data: any) {
                parser.parse(getShapesGraph(), "text/turtle", function (shapes: any) {
                    let validator = new SHACLValidator(data.getSHACLStore(), shapes.getSHACLStore());
                    validator.updateValidationEngine();
                    validator.showValidationResults(function (err: any, report: any) {
                        expect(report.conforms()).toEqual(true);
                        done();
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

            // the merged graph should contain the other graph's triples and prefixes
            expect(graph.getN3Store().countTriples()).toEqual(2);
            expect(graph.getSHACLStore().length).toEqual(2);

            let key = "rdf";
            expect(graph.getPrefixes()[key]).toEqual("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

            // the merged graph should also contain the other graph's changes
            let changes = graph.getChanges().getValue(ChangeSet.ADD);
            if (changes) {
                expect(changes.contains(new Statement(
                    "http://en.wikipedia.org/wiki/Tony_Benn",
                    "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"', graph.getSHACLStore()))).toEqual(true);
            }
       });

    it("should maintain a consistent reflection of changes made to the graph structure.",
       () => {
            let graph = new Graph();
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let changes = graph.getChanges().getValue(ChangeSet.ADD);
            if (changes) {
                expect(changes.contains(new Statement(
                    "http://en.wikipedia.org/wiki/Tony_Benn",
                    "http://purl.org/dc/elements/1.1/title", '"Tony Benn"', graph.getSHACLStore()))).toEqual(true);
            }

            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            // antithetical operations should cancel each other out
            expect(graph.hasChanged()).toEqual(false);

            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');

            expect(graph.hasChanged()).toEqual(true);

            graph.clearChanges();

            expect(graph.hasChanged()).toEqual(false);

            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');

            // this time the removal is registered as a change, as no inverse addition has preceded it
            changes = graph.getChanges().getValue(ChangeSet.REMOVE);
            if (changes) {
                expect(changes.contains(new Statement(
                    "http://en.wikipedia.org/wiki/Tony_Benn",
                    "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"', graph.getSHACLStore()))).toEqual(true);
            }

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