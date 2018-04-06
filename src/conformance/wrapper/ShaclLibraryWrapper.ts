/**
 * Created by Matthias Langhendries on 06-Apr-18.
 */

import SHACLValidator from "../shacl.js";
/**
 * A wrapper for the shacl.js library. This class makes it easy to interact with the validation logic.
 *
 */
export class ShaclWrapper {

    public validate(data: string, dataType: string, shapes: string, shapesType: string): void {
        var validator = new SHACLValidator();
        validator.validate(data, "text/turtle", shapes, "text/turtle", function (e: any, report: any) {
            console.log("Conforms? " + report.conforms());
            if (report.conforms() === false) {
                report.results().forEach(function (result: any) {
                    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                    console.log(" - Severity: " + result.severity() + " for " + result.sourceConstraintComponent());
                    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                });
            }
        });
    }
}