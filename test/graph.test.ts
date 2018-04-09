import {Statement} from "rdflib";
import {ChangeSet, Graph} from "../src/persistence/graph";

describe("Graph Class", () => {
    it("should maintain a consistent store for persistence purposes.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a triple
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let triple = graph.getStore().getTriples()[0];
            expect(triple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(triple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(triple.object).toEqual('"Tony Benn"');

            // TEST CASE: updating a triple
            graph.updateTriple(triple.subject, triple.predicate, triple.object,
                               {nObject: '"Someone else"'});

            let updatedTriple = graph.getStore().getTriples()[0];
            expect(updatedTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(updatedTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(updatedTriple.object).toEqual('"Someone else"');

            // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Someone else"');

            expect(graph.getStore().countTriples()).toEqual(0);

            // TEST CASE: adding multiple triples
            graph.addTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
                {
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
                }]);

            let firstTriple = graph.getStore().getTriples()[0];
            expect(firstTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
            expect(firstTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
            expect(firstTriple.object).toEqual('"Tony Benn"');

            let secondTriple = graph.getStore().getTriples()[1];
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

            expect(graph.getStore().countTriples()).toEqual(0);
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
            expect(graph.getStore().countTriples()).toEqual(2);

            let key = "rdf";
            expect(graph.getPrefixes()[key]).toEqual("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

            // the merged graph should also contain the other graph's changes
            let changes = graph.getChanges().getValue(ChangeSet.ADD);
            if (changes) {
                expect(changes.contains({
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'})).toEqual(true);
            }
       });

    it("should maintain a consistent reflection of changes made to the graph structure.",
       () => {
            let graph = new Graph();
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let changes = graph.getChanges().getValue(ChangeSet.ADD);
            if (changes) {
                expect(changes.contains({
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'})).toEqual(true);
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
                expect(changes.contains({
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'})).toEqual(true);
            }

        });
});