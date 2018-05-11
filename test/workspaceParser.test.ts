import {WorkspaceParser} from "../src/persistence/workspaceParser";
import {ModelData} from "../src/entities/modelData";
import {Component} from "../src/persistence/component";
import {ImmutableGraph} from "../src/persistence/graph";
import {ModelComponent} from "../src/entities/modelTaskMetadata";
import {GraphParser} from "../src/persistence/graphParser";

describe("WorkspaceParser Class", () => {
    it("should parse valid JSON and return a workspace containing the " +
        "components described therein.",
        (done) => {
            let parser = new WorkspaceParser();
            parser.parse(generateJSON(),
                "application/json", result => {
                expect(result.getComponent(ModelComponent.SHACLShapesGraph)).toBeDefined();
                expect(result.getComponent(ModelComponent.DataGraph)).toBeDefined();
                expect(result.getComponent(ModelComponent.IO)).toBeDefined();

                let SHACLComponent = result.getOrCreateComponent(
                    ModelComponent.SHACLShapesGraph,
                    () => new Component<ImmutableGraph>()
                );

                let dataComponent = result.getOrCreateComponent(
                    ModelComponent.DataGraph,
                    () => new Component<ImmutableGraph>()
                );

                let ioComponent = result.getOrCreateComponent(
                    ModelComponent.IO,
                    () => new Component<ImmutableGraph>()
                );

                expect(SHACLComponent.getCompositeParts().length).toEqual(1);
                expect(dataComponent.getCompositeParts().length).toEqual(1);
                expect(ioComponent.getCompositeParts().length).toEqual(2);

                let SHACLGraph = SHACLComponent.getCompositeParts()[0];
                let dataGraph = dataComponent.getCompositeParts()[0];

                expect(SHACLGraph[0]).toEqual("shacl.ttl");
                expect(dataGraph[0]).toEqual("data.ttl");

                SHACLGraph[1].queryN3Store(store => {
                    expect(store.countTriples()).toEqual(15);
                });

                SHACLGraph[1].query(store => {
                    expect(store.match().length).toEqual(15);
                });

                dataGraph[1].queryN3Store(store => {
                    expect(store.countTriples()).toEqual(2);
                });

                dataGraph[1].query(store => {
                    expect(store.match().length).toEqual(2);
                });

                expect(ioComponent.getCompositeParts()[0][0]).toEqual(SHACLGraph[0]);
                expect(ioComponent.getCompositeParts()[1][0]).toEqual(dataGraph[0]);

                done();
            });
        });

    it("should serialize a workspace to an string representation in JSON format.",
        (done) => {
            let workspace = new ModelData();

            let SHACLComponent = workspace.getOrCreateComponent(
                ModelComponent.SHACLShapesGraph,
                () => new Component<ImmutableGraph>()
            );

            let dataComponent = workspace.getOrCreateComponent(
                ModelComponent.DataGraph,
                () => new Component<ImmutableGraph>()
            );

            let ioComponent = workspace.getOrCreateComponent(
                ModelComponent.IO,
                () => new Component<ImmutableGraph>()
            );

            let graphParser = new GraphParser();
            graphParser.parse(getShapesGraph(), "text/turtle", shapes => {
                graphParser.clean();
                graphParser.parse(getDataGraph(), "text/turtle", data => {
                    workspace.setComponent(ModelComponent.SHACLShapesGraph,
                        SHACLComponent.withPart("shacl.ttl", shapes.asImmutable()));
                    workspace.setComponent(ModelComponent.DataGraph,
                        dataComponent.withPart("data.ttl", data.asImmutable()));

                    workspace.setComponent(ModelComponent.IO,
                        ioComponent.withPart("shacl.ttl", shapes.asImmutable())
                                   .withPart("data.ttl", data.asImmutable()));

                    let parser = new WorkspaceParser();
                    parser.serialize(workspace, "application/json", result => {
                        let trimmedResult = result.replace(/\s+/g, "");
                        let trimmedTarget = generateJSON().replace(/\s+/g, "");
                        expect(trimmedResult).toEqual(trimmedTarget);
                        done();
                    });
                });
            });

        });

    it("should throw an error when passed an unsupported MIME type.",
        () => {
            let parser = new WorkspaceParser();
            expect(() => parser.parse("", "application/rdf+xml", null))
                .toThrow(Error("Incorrect MimeType application/rdf+xml!"));

            expect(() => parser.serialize(new ModelData(), "application/rdf+xml", null))
                .toThrow(Error("Incorrect MimeType application/rdf+xml!"));
        });
});

function generateJSON() {
    return '{\n' +
        '  "SHACLShapesGraph": [\n' +
        '    {\n' +
        '      "id": "shacl.ttl",\n' +
        '      "triples": [\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",\n' +
        '          "object": "http://www.w3.org/ns/shacl#NodeShape"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#targetClass",\n' +
        '          "object": "http://example.com/ns#Person"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#property",\n' +
        '          "object": "_:b25"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#property",\n' +
        '          "object": "_:b24"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#closed",\n' +
        '          "object": "true"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#ignoredProperties",\n' +
        '          "object": "_:b26"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#path",\n' +
        '          "object": "http://example.com/ns#ssn"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#maxCount",\n' +
        '          "object": "1"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#datatype",\n' +
        '          "object": "http://www.w3.org/2001/XMLSchema#string"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#pattern",\n' +
        '          "object": "^\\\\d{3}-\\\\d{2}-\\\\d{4}$"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b25",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#path",\n' +
        '          "object": "http://example.com/ns#worksFor"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b25",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#class",\n' +
        '          "object": "http://example.com/ns#Company"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b25",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#nodeKind",\n' +
        '          "object": "http://www.w3.org/ns/shacl#IRI"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b26",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",\n' +
        '          "object": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b26",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",\n' +
        '          "object": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "DataGraph": [\n' +
        '    {\n' +
        '      "id": "data.ttl",\n' +
        '      "triples": [\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#Alice",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",\n' +
        '          "object": "http://example.com/ns#Person"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#Alice",\n' +
        '          "predicate": "http://example.com/ns#ssn",\n' +
        '          "object": "987-65-4323"\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "IO": [\n' +
        '    {\n' +
        '      "id": "shacl.ttl",\n' +
        '      "triples": [\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",\n' +
        '          "object": "http://www.w3.org/ns/shacl#NodeShape"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#targetClass",\n' +
        '          "object": "http://example.com/ns#Person"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#property",\n' +
        '          "object": "_:b25"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#property",\n' +
        '          "object": "_:b24"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#closed",\n' +
        '          "object": "true"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#PersonShape",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#ignoredProperties",\n' +
        '          "object": "_:b26"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#path",\n' +
        '          "object": "http://example.com/ns#ssn"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#maxCount",\n' +
        '          "object": "1"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#datatype",\n' +
        '          "object": "http://www.w3.org/2001/XMLSchema#string"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b24",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#pattern",\n' +
        '          "object": "^\\\\d{3}-\\\\d{2}-\\\\d{4}$"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b25",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#path",\n' +
        '          "object": "http://example.com/ns#worksFor"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b25",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#class",\n' +
        '          "object": "http://example.com/ns#Company"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b25",\n' +
        '          "predicate": "http://www.w3.org/ns/shacl#nodeKind",\n' +
        '          "object": "http://www.w3.org/ns/shacl#IRI"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b26",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",\n' +
        '          "object": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "_:b26",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",\n' +
        '          "object": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"\n' +
        '        }\n' +
        '      ]\n' +
        '    },\n' +
        '    {\n' +
        '      "id": "data.ttl",\n' +
        '      "triples": [\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#Alice",\n' +
        '          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",\n' +
        '          "object": "http://example.com/ns#Person"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://example.com/ns#Alice",\n' +
        '          "predicate": "http://example.com/ns#ssn",\n' +
        '          "object": "987-65-4323"\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ]\n' +
        '}';
}

function getDataGraph() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:Alice\n' +
        'a ex:Person ;\n' +
        'ex:ssn "987-65-4323" .';
}

function getShapesGraph() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:PersonShape \n' +
        'a sh:NodeShape ;\n' +
        'sh:targetClass ex:Person ;\n' +
        'sh:property [\n' +
        'sh:path ex:ssn ;\n' +
        'sh:maxCount 1 ;\n' +
        'sh:datatype xsd:string ;\n' +
        'sh:pattern "^\\\\d{3}-\\\\d{2}-\\\\d{4}$" ;\n' +
        '] ;\n' +
        'sh:property [\n' +
        'sh:path ex:worksFor ;\n' +
        'sh:class ex:Company ;\n' +
        'sh:nodeKind sh:IRI ;\n' +
        '] ;\n' +
        'sh:closed true ;\n' +
        'sh:ignoredProperties ( rdf:type ) .';
}