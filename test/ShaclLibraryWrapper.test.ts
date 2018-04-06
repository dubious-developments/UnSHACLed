import {ShaclWrapper} from "../src/conformance/wrapper/ShaclLibraryWrapper";

/**
 * Created by Matthias Langhendries on 06-Apr-18.
 */

describe("ShaclLibraryWrapper Class", () => {
    it("Given shapes and conforming data, returns a report with conforming message.",
       () => {
            let validationWrapper = new ShaclWrapper();
            validationWrapper.validate(getDataGraph(), '' , getShapesGraph(), '');
       });

    it("Given shapes and non-conforming data, returns a report with non-conforming problem data.",
       () => {
            let validationWrapper = new ShaclWrapper();
            validationWrapper.validate(getNonConformingDataGraph(), '' , getShapesGraph(), '');
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

function getNonConformingDataGraph() {
    return 'ex:Alice' +
        'a ex:Person ;' +
        'ex:ssn "987-65-432A" .';
}