import {Statement} from "rdflib";
import {Graph, ImmutableGraph} from "../src/persistence/graph";

describe("Graph Class", () => {
    it("can add a triple twice", () => {
        let graph = new Graph();

        graph.addTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        graph.addTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
    });

    it("can remove a nonexistent triple", () => {
        let graph = new Graph();

        graph.removeTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        expect(
            !graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
    });

    it("can undo an insertion", () => {
        let graph = new Graph();
        let oldImmutable = graph.asImmutable();

        graph.addTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
        expect(
            oldImmutable.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeFalsy();
        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
    });

    it("can undo a deletion", () => {
        let graph = new Graph();

        graph.addTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        let oldImmutable = graph.asImmutable();

        graph.removeTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeFalsy();
        expect(
            oldImmutable.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeFalsy();
    });

    it("can be created from an immutable graph", () => {
        let oldImmutable = ImmutableGraph.create();
        let graph = oldImmutable.toMutable();

        graph.addTriple(
            "http://en.wikipedia.org/wiki/Tony_Benn",
            "http://purl.org/dc/elements/1.1/title",
            '"Tony Benn"');

        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
        expect(
            oldImmutable.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeFalsy();
        expect(
            graph.containsTriple(
                "http://en.wikipedia.org/wiki/Tony_Benn",
                "http://purl.org/dc/elements/1.1/title",
                '"Tony Benn"')).toBeTruthy();
    });

    it("can define a prefix", () => {
        let graph = new Graph();

        graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");

        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
    });

    it("can define a prefix twice", () => {
        let graph = new Graph();

        graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");
        graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");

        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
    });

    it("can redefine a prefix", () => {
        let graph = new Graph();

        graph.addPrefix("dc", "http://purl.org/dc/elements/0.1/");
        graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");

        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
    });

    it("can undo a prefix definition", () => {
        let graph = new Graph();
        let oldImmutable = graph.asImmutable();

        graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");

        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
        expect("dc" in oldImmutable.getPrefixes()).toBeFalsy();
        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
    });

    it("can undo a prefix redefinition", () => {
        let graph = new Graph();
        let oldImmutable1 = graph.asImmutable();

        graph.addPrefix("dc", "http://purl.org/dc/elements/0.1/");

        let oldImmutable2 = graph.asImmutable();

        graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");

        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
        expect("dc" in oldImmutable1.getPrefixes()).toBeFalsy();
        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
        expect(oldImmutable2.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/0.1/");
        expect(graph.getPrefixes()["dc"]).toEqual("http://purl.org/dc/elements/1.1/");
    });

    it("should maintain a consistent store for persistence purposes.",
       () => {
            let graph = new Graph();

            // TEST CASE: adding a triple
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            graph.queryN3Store(store => {
                let triple = store.getTriples()[0];
                expect(triple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
                expect(triple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
                expect(triple.object).toEqual('"Tony Benn"');
            });

            // TEST CASE: updating a triple
            graph.updateTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                               {nObject: '"Someone else"'});

            graph.queryN3Store(store => {
               let triple = store.getTriples()[0];
               expect(triple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
               expect(triple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
               expect(triple.object).toEqual('"Someone else"');
           });

            // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Someone else"');

            graph.queryN3Store(store => {
                expect(store.countTriples()).toEqual(0);
            });

            // TEST CASE: adding multiple triples
            graph.addTriples([{
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'
            },
            {
                subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'
            }]);

            graph.queryN3Store(store => {
                let firstTriple = store.getTriples()[0];
                expect(firstTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
                expect(firstTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/title");
                expect(firstTriple.object).toEqual('"Tony Benn"');

                let secondTriple = store.getTriples()[1];
                expect(secondTriple.subject).toEqual("http://en.wikipedia.org/wiki/Tony_Benn");
                expect(secondTriple.predicate).toEqual("http://purl.org/dc/elements/1.1/publisher");
                expect(secondTriple.object).toEqual('"Wikipedia"');
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

            graph.queryN3Store(store => {
                expect(store.countTriples()).toEqual(0);
            });
        });

    it("should maintain a consistent rdflib store.",
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

            // TEST CASE: updating a triple
            graph.updateTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"',
                               {nObject: '"Someone else"'});

            graph.query(store => {
               let statement = store.match()[0];
               let matchingStatement = new Statement(
                   "http://en.wikipedia.org/wiki/Tony_Benn",
                   "http://purl.org/dc/elements/1.1/title", '"Someone else"',
                   store);
               expect(statement.equals(matchingStatement)).toEqual(true);
           });

            // TEST CASE: removing a triple
            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Someone else"');

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

    it("should maintain a consistent reflection of changes made to the graph structure.",
       () => {
            let graph = new Graph();
            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            let additions = graph.getLatestAdditions();
            expect(additions.contains({
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/title", object: '"Tony Benn"'})).toEqual(true);

            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

            // antithetical operations should cancel each other out
            expect(graph.hasRecentlyChanged()).toEqual(false);

            graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                            "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');

            expect(graph.hasRecentlyChanged()).toEqual(true);

            graph.clearRecentChanges();

            expect(graph.hasRecentlyChanged()).toEqual(false);

            graph.removeTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                               "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');

            // this time the removal is registered as a change, as no inverse addition has preceded it
            let removals = graph.getLatestRemovals();
            expect(removals.contains({
                    subject: "http://en.wikipedia.org/wiki/Tony_Benn",
                    predicate: "http://purl.org/dc/elements/1.1/publisher", object: '"Wikipedia"'})).toEqual(true);

        });

    it("should be able to merge with another graph based on internal change sets.",
       () => {
           let graph = new Graph();
           let other = new Graph();

           graph.addPrefix("dc", "http://purl.org/dc/elements/1.1/");
           graph.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                           "http://purl.org/dc/elements/1.1/title", '"Tony Benn"');

           other.addPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
           other.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                           "http://purl.org/dc/elements/1.1/publisher", '"Wikipedia"');

           graph.incrementalMerge(other);

           // the merged graph should contain the other graph's triples and prefixes
           expect(graph.queryN3Store(store => store.countTriples())).toEqual(2);
           expect(graph.query(store => store.length)).toEqual(2);

           let key = "rdf";
           expect(graph.getPrefixes()[key]).toEqual("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

           other.clearRecentChanges();

           other.addTriple("http://en.wikipedia.org/wiki/Tony_Benn",
                           "http://purl.org/dc/elements/1.1/creator", '"Some Guy On the Internet"');

           graph.incrementalMerge(other);

           // the incremental merge should only have added recent additions
           expect(graph.queryN3Store(store => store.countTriples())).toEqual(3);
           expect(graph.query(store => store.length)).toEqual(3);
        });
});