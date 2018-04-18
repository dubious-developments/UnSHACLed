import {WellDefinedSHACLValidator} from "../src/conformance/SHACLValidator";
import {ValidationReport} from "../src/conformance/wrapper/ValidationReport";
import {Model} from "../src/entities/model";
import {ModelComponent} from "../src/entities/modelTaskMetadata";
import {GraphParser} from "../src/persistence/graphParser";
import {Component} from "../src/persistence/component";

describe("WellDefinedSHACLValidator Class", () => {
    it("should perform correct validation for conforming data.",
       (done) => {
            let parser = new GraphParser();
            let validator = new WellDefinedSHACLValidator();
            parser.parse(getConformingDataGraph(), "text/turtle", function (data: any) {
                parser.clean();
                parser.parse(getShapesGraph(), "text/turtle", function (shapes: any) {
                    validator.doValidation(data, shapes,
                                           function (report: ValidationReport) {
                            expect(report.isConforming()).toBe(true);
                            done();
                        });
                });
            });
        });

    it("should perform correct validation for non-conforming data.",
       (done) => {
            let parser = new GraphParser();
            let validator = new WellDefinedSHACLValidator();
            parser.parse(getNonConformingDataGraph(), "text/turtle", function (data: any) {
                parser.clean();
                parser.parse(getShapesGraph(), "text/turtle", function (shapes: any) {
                    validator.doValidation(data, shapes,
                                           function (report: ValidationReport) {
                            expect(report.isConforming()).toBe(false);
                            done();
                        });
                });
            });
        });

    it("should perform correct validation for playground data.",
       (done) => {
            let parser = new GraphParser();
            let validator = new WellDefinedSHACLValidator();
            parser.parse(getPlaygroundData(), "text/turtle", function (data: any) {
                parser.clean();
                parser.parse(getPlaygroundShapes(), "text/turtle", function (shapes: any) {
                    validator.doValidation(data, shapes,
                                           function (report: ValidationReport) {
                            expect(report.isConforming()).toBe(false);
                            done();
                        });
                });
            });
        });

    it("should validate correctly (i.e. validation should integrate with " +
        "the Model).",
       (done) => {
            let validator = new WellDefinedSHACLValidator();
            let model = new Model();
            let parser = new GraphParser();
            let comp1 = new Component();
            let comp2 = new Component();

            let busy = true;
            parser.parse(getConformingDataGraph(), "text/turtle", function (data1: any) {
                parser.clean();
                parser.parse(getNonConformingDataGraph(), "text/turtle", function (data2: any) {
                    parser.clean();
                    parser.parse(getShapesGraph(), "text/turtle", function (shapes: any) {
                        comp1 = comp1.withPart("test1", data1);
                        comp1 = comp1.withPart("test2", data2);
                        comp2 = comp2.withPart("test", shapes);
                        model.tasks.schedule(
                            Model.createTask(
                                (data) => {
                                    data.setComponent(ModelComponent.DataGraph, comp1);
                                    data.setComponent(ModelComponent.SHACLShapesGraph, comp2);
                                    busy = false;
                                },
                                [],
                                [ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph]));
                        model.tasks.processAllTasks();

                        // this is pretty horrible and there probably exists a better way of doing this,
                        // but at the moment I can't seem to think of one
                        while (busy) {
                        }

                        model.tasks.schedule(
                            Model.createTask(
                                (data) => {
                                    validator.validate(data, function (report: ValidationReport) {
                                        expect(report.isConforming()).toBe(false);
                                        done();
                                    });
                                },
                                [],
                                [ModelComponent.ValidationReport]));
                        model.tasks.processAllTasks();
                    });
                });
            });

        });
});

function getConformingDataGraph() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:Alice\n' +
        'a ex:Person ;\n' +
        'ex:ssn "987-65-4323" .';
}

function getNonConformingDataGraph() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:Bob\n' +
        'a ex:Person ;\n' +
        'ex:ssn "123-45-6789" ;\n' +
        'ex:ssn "124-35-6789" .';
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

function getPlaygroundData() {
    return "@prefix ex: <http://example.org/ns#> .\n" +
        "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
        "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n" +
        "@prefix schema: <http://schema.org/> .\n" +
        "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n" +
        "\n" +
        "ex:Bob\n" +
        "    a schema:Person ;\n" +
        "    schema:givenName \"Robert\" ;\n" +
        "    schema:familyName \"Junior\" ;\n" +
        "    schema:birthDate \"1971-07-07\"^^xsd:date ;\n" +
        "    schema:deathDate \"1968-09-10\"^^xsd:date ;\n" +
        "    schema:address ex:BobsAddress .\n" +
        "\n" +
        "ex:BobsAddress\n" +
        "    schema:streetAddress \"1600 Amphitheatre Pkway\" ;\n" +
        "    schema:postalCode 9404 .";
}

function getPlaygroundShapes() {
    return "@prefix dash: <http://datashapes.org/dash#> .\n" +
        "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
        "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n" +
        "@prefix schema: <http://schema.org/> .\n" +
        "@prefix sh: <http://www.w3.org/ns/shacl#> .\n" +
        "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n" +
        "\n" +
        "schema:PersonShape\n" +
        "    a sh:NodeShape ;\n" +
        "    sh:targetClass schema:Person ;\n" +
        "    sh:property [\n" +
        "        sh:path schema:givenName ;\n" +
        "        sh:datatype xsd:string ;\n" +
        "        sh:name \"given name\" ;\n" +
        "    ] ;\n" +
        "    sh:property [\n" +
        "        sh:path schema:birthDate ;\n" +
        "        sh:lessThan schema:deathDate ;\n" +
        "        sh:maxCount 1 ;\n" +
        "    ] ;\n" +
        "    sh:property [\n" +
        "        sh:path schema:gender ;\n" +
        "        sh:in ( \"female\" \"male\" ) ;\n" +
        "    ] ;\n" +
        "    sh:property [\n" +
        "        sh:path schema:address ;\n" +
        "        sh:node schema:AddressShape ;\n" +
        "    ] .\n" +
        "\n" +
        "schema:AddressShape\n" +
        "    a sh:NodeShape ;\n" +
        "    sh:closed true ;\n" +
        "    sh:property [\n" +
        "        sh:path schema:streetAddress ;\n" +
        "        sh:datatype xsd:string ;\n" +
        "    ] ;\n" +
        "    sh:property [\n" +
        "        sh:path schema:postalCode ;\n" +
        "        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype xsd:integer ] ) ;\n" +
        "        sh:minInclusive 10000 ;\n" +
        "        sh:maxInclusive 99999 ;\n" +
        "    ] .";
}
