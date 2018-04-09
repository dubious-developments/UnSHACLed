/**
 * Created by Matthias Langhendries on 06-Apr-18.
 */

import SHACLValidator from "../../conformance/shacl/index.js";

/**
 * A wrapper for the shacl.js library. This class makes it easy to interact with the validation logic.
 *
 */
export class ShaclWrapper {

    public unshacledValidate(data: string, dataType: string, shapes: string, shapesType: string): void {
        let validator = new SHACLValidator();
        console.log("11111111111111111111111111111111111111111111111");
        validator.validate(data, "text/turtle", shapes, "text/turtle", function (e: any, report: any) {
            console.log("222222222222222222222222222222222222222222222222222222222222");
            console.log("Conforms? " + report.conforms());
            if (report.conforms() === false) {
                report.results().forEach(function (result: any) {
                    console.log("33333333333333333333333333333333333333333333333333333333333333");
                    console.log(" - Severity: " + result.severity() + " for " + result.sourceConstraintComponent());
                    console.log("444444444444444444444444444444444444444444444444444444444444444");
                });
            }
        });
    }
}