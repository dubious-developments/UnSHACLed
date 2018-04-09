import SHACLValidator from "../src/conformance/shacl/index.js";
import {ShaclWrapper} from "../src/conformance/wrapper/ShaclLibraryWrapper"

/**
 * Created by Matthias Langhendries on 06-Apr-18.
 */

describe("ShaclLibraryWrapper Class", () => {
    it("Given shapes and conforming data, returns a report with conforming message.",
       () => {
            console.log('test 1 matti');
            let validationWrapper = new ShaclWrapper();
            validationWrapper.unshacledValidate(getConformingDataGraph(), '' , getShapesGraph(), '');
       });

    it("Given shapes and non-conforming data, returns a report with non-conforming problem data.",
       () => {
            console.log('test 2 matti');
            let validationWrapper = new ShaclWrapper();
            validationWrapper.unshacledValidate(getNonConformingDataGraph(), '' , getShapesGraph(), '');
       });

});

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