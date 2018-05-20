import SHACLValidator from "../src/conformance/shacl/index.js";
import { ValidationReport } from "../src/conformance/ValidationReport";

/*
 * Created by Matthias Langhendries on 06-Apr-18.
 */

describe("ShaclLibraryWrapper Class", () => {
    it("Given shapes and 1 non-conforming line of data (multiple SSN's for one person (Bob), while" +
        " only 1 SSN is allowed. Returns a report with non-conforming problem data.",
       (done) => {
                   let validator = new SHACLValidator();
                   validator.validate(getNonConformingDataGraphDoubleSsn(),
                                      'text/turtle', getShapesGraph(), 'text/turtle',
                                      function (error: any, r: any) {
                           let report = new ValidationReport(r);
                           expect(report.isConforming()).toEqual(false);

                           expect(report.getValidationErrors().length).toEqual(1);

                           expect(report.getValidationErrors()[0].getShapeProperty())
                               .toEqual("http://example.com/ns#ssn");

                           expect(report.getValidationErrors()[0].getDataElement())
                               .toEqual("http://example.com/ns#Bob");

                           expect(report.getValidationErrors()[0].getMessage()).toEqual("More than 1 values");

                           expect(report.getValidationErrors()[0].getShapeConstraint())
                        .toEqual("http://www.w3.org/ns/shacl#MaxCountConstraintComponent");
                           done();
                });
       });

    it("Given shapes and 1 non-conforming line of data (SSN is wrongly formatted) for one person (Bob)." +
       ". Returns a report with the non-conforming problem data.",
       (done) => {
                    let validator = new SHACLValidator();
                    validator.validate(getNonConformingDataGraphWrongSsnFormat(),
                                       'text/turtle', getShapesGraph(), 'text/turtle',
                                       function (error: any, r: any) {
                            let report = new ValidationReport(r);

                            expect(report.isConforming()).toEqual(false);

                            expect(report.getValidationErrors().length).toEqual(1);

                            expect(report.getValidationErrors()[0].getShapeProperty())
                                .toEqual("http://example.com/ns#ssn");

                            expect(report.getValidationErrors()[0].getDataElement())
                                .toEqual("http://example.com/ns#Bob");

                            expect(report.getValidationErrors()[0].getMessage())
                        .toEqual("Value does not match pattern \"^\\d{3}-\\d{2}-\\d{4}$\"");

                            expect(report.getValidationErrors()[0].getShapeConstraint())
                        .toEqual("http://www.w3.org/ns/shacl#PatternConstraintComponent");
                            done();
                });
        });

    it("Given shapes and 2 non-conforming lines of data `(wrong SSN format and multiple SSN 's, " +
        "returns a report with non-conforming problem data.",
       (done) => {
                    let validator = new SHACLValidator();
                    validator.validate(getNonConformingDataGraph2Mistakes(),
                                       'text/turtle', getShapesGraph(), 'text/turtle',
                                       function (error: any, r: any) {
                            let report = new ValidationReport(r);

                            expect(report.isConforming()).toEqual(false);

                            expect(report.getValidationErrors().length).toEqual(2);

                            expect(report.getValidationErrors()[0].getShapeProperty())
                                .toEqual("http://example.com/ns#ssn");

                            expect(report.getValidationErrors()[0].getDataElement())
                                .toEqual("http://example.com/ns#Bob");

                            expect(report.getValidationErrors()[0].getMessage())
                                .toEqual("More than 1 values");

                            expect(report.getValidationErrors()[0].getShapeConstraint())
                        .toEqual("http://www.w3.org/ns/shacl#MaxCountConstraintComponent");

                            expect(report.getValidationErrors()[1].getShapeProperty())
                                .toEqual("http://example.com/ns#ssn");

                            expect(report.getValidationErrors()[1].getDataElement())
                                .toEqual("http://example.com/ns#Bob");

                            expect(report.getValidationErrors()[1].getMessage())
                        .toEqual("Value does not match pattern \"^\\d{3}-\\d{2}-\\d{4}$\"");

                            expect(report.getValidationErrors()[1].getShapeConstraint())
                        .toEqual("http://www.w3.org/ns/shacl#PatternConstraintComponent");

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
        'ex:ssn "987-65-4324" .';
}

function getNonConformingDataGraphDoubleSsn() {
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

function getNonConformingDataGraphWrongSsnFormat() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:Bob\n' +
        'a ex:Person ;\n' +
        'ex:ssn "124-35/677A" .';
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

function getNonConformingDataGraph2Mistakes() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:Bob\n' +
        'a ex:Person ;\n' +
        'ex:ssn "124-35-4444" ;\n ' +
        'ex:ssn "124-35/677A" .';

}