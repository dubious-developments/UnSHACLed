import {WellDefinedSHACLValidator} from "../src/conformance/SHACLValidator";
import {ValidationReport} from "../src/conformance/ValidationReport";
import SHACLValidator from "../src/conformance/shacl/index";

describe("WellDefinedSHACLValidator Class", () => {
    it("should perform correct validation for conforming data.",
       (done) => {
           // let validator = new WellDefinedSHACLValidator();
           // validator.doValidation(getConformingDataGraph(), getShapesGraph(),
           //                        function (report: ValidationReport) {
           //         expect(report.isConforming()).toBe(true);
           //         done();
           //     });

           // let validator = new SHACLValidator();
           // validator.validate(getConformingDataGraph(), 'text/turtle', getShapesGraph(),
           //                    'text/turtle', function (error: any, report: any) {
           //      expect(report.conforms()).toBe(true);
           //      done();
           // });

        });

    it("should perform correct validation for non-conforming data.",
       (done) => {
           // let validator = new WellDefinedSHACLValidator();
           // validator.doValidation(getNonConformingDataGraph(), getShapesGraph(),
           //                        function (report: ValidationReport) {
           //         expect(report.isConforming()).toBe(false);
           //         done();
           //     });

           let validator = new SHACLValidator();
           validator.validate(getPlaygroundData(), 'text/turtle', getPlaygroundShapes(),
                              'text/turtle', function (error: any, report: any) {
                   console.log("HAHA");
                   expect(report.conforms()).toBe(false);
                   done();
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
        'ex:ssn "987-65-432A" .';
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
