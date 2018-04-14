import {ShaclWrapper} from "../src/conformance/wrapper/ShaclLibraryWrapper"

import { ConformanceReport } from "../src/conformance/wrapper/ConformanceReport";

/*
 * Created by Matthias Langhendries on 06-Apr-18.
 */

describe("ShaclLibraryWrapper Class", () => {
    it("Given shapes and conforming data, returns a report with conforming message.",
       (done) => {
            console.log('test 1 conformance');
            let validationWrapper = new ShaclWrapper();
            validationWrapper.unshacledValidate(getConformingDataGraph(), '' , getShapesGraph(), '');
            done();
       });

    it("Given shapes and 1 non-conforming line of data, returns a report with non-conforming problem data.",
       (done) => {
            console.log('test 2 non-conformance');
            let validationWrapper = new ShaclWrapper();
            validationWrapper.unshacledValidate(getNonConformingDataGraph(), '' , getShapesGraph(), '');
            done();
       });

    it("Given shapes and 1 non-conforming line of data, returns a report with non-conforming problem data.",
        (done) => {
            console.log('test 3 non-conformance');
            let validationWrapper = new ShaclWrapper();
            validationWrapper.unshacledValidate(getNonConformingDataGraphWrongSsnFormat(), '' , getShapesGraph(), '');
            done();
        });

    it("Given shapes and 2 non-conforming lines of data, returns a report with non-conforming problem data.",
        (done) => {
            console.log('test 4 non-conformance');
            let validationWrapper = new ShaclWrapper();
            validationWrapper.unshacledValidate(getNonConformingDataGraph2Mistakes(), '' , getShapesGraph(), '');
            done();
        });

    it("Given shapes and 2 non-conforming lines of data, returns a report with non-conforming problem data.",
        (done) => {
            console.log('test 5 non-conformance');
            let conformanceReport = new ConformanceReport();
            conformanceReport.conforms(getNonConformingDataGraph2Mistakes(), "text/turtle" , getShapesGraph(),
                "text/turtle", function(report: any){
                    console.log(
                        report.getValidationErrors().length + "mistakes. \n"
                    );
                    console.log(
                        report.getValidationErrors()[0].getMessage() + "\n" +
                        report.getValidationErrors()[0].getDataElement() + "\n" +
                        report.getValidationErrors()[0].getShapeConstraint() + "\n" +
                        report.getValidationErrors()[0].getShapeProperty()
                    );
                    done();
                });
        });

//
});



/*
function getDataGraph() {
    return 'ex:Alice' +
        'a ex:Person ;' +
        'ex:ssn "987-65-432A" .';
}

function getNonConformingDataGraph() {
    return 'ex:Alice' +
        'a ex:Person ;' +
        'ex:ssn "987-65-4A" .';
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
 */

/*
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
*/

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




/*
 describe("WellDefinedSHACLValidator Class", () => {
 it("should perform correct validation for conforming data.",
 (done) => {
 // let validator = new WellDefinedSHACLValidator();
 // validator.doValidation(getConformingDataGraph(), getShapesGraph(),
 //                        function (report: ValidationReport) {
 //         expect(report.isConforming()).toBe(true);
 //         done();
 //     });

 let validator = new SHACLValidator();
 validator.validate(getConformingDataGraph(), 'text/turtle', getShapesGraph(),
 'text/turtle', function (error: any, report: any) {
 expect(report.conforms()).toBe(true);
 done();
 });

 });

 it("should perform correct validation for non-conforming data.",
 (done) => {
 // let validator = new WellDefinedSHACLValidator();
 // validator.doValidation(getNonConformingDataGraph(), getShapesGraph(),
 //                        function (report: ValidationReport) {
 //         expect(report.isConforming()).toBe(false);
 //         done();
 //     });

 let report;
 let validator = new SHACLValidator();
 validator.validate(getNonConformingDataGraph(), 'text/turtle', getShapesGraph(),
 'text/turtle', function (error: any, r: any) {
 expect(report.conforms()).toBe(false);
 done();
 });

 });
 });
 */
