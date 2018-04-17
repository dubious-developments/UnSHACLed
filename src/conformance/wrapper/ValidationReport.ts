/**
 * Created by Matthias on 12-Apr-18.
 */

export class ValidationError {

    private message: string;
    private shapeProperty: string;
    private shapeConstraint: string;
    private dataElement: string;

    /* Example: the data value bob (focusNode) does not conform because ssn (path) does not oblige to MaxCount:1
     * (sourceConstraintComponent)
     *
     * Mapping scheme:
     * dataElement = focusNode
     * shapeProperty = path
     * shapeConstraint = sourceConstraintComponent
     *
     * */
    constructor(message: string, shapeProperty: string, shapeConstraint: string, dataElement: string) {
        this.message = message;
        this.shapeProperty = shapeProperty;
        this.shapeConstraint = shapeConstraint;
        this.dataElement = dataElement;
    }

    public toString(): string {
        return "The data value: " + this.dataElement + ", does not conform because: " + this.shapeProperty +
            "does not oblige to: " + this.shapeConstraint;
    }

    public getMessage(): string {
        return this.message;
    }

    public getShapeProperty(): string {
        return this.shapeProperty;
    }

    public getShapeConstraint(): string {
        return this.shapeConstraint;
    }

    public getDataElement(): string {
        return this.dataElement;
    }

}

export class ValidationReport {

   private conforming: boolean;
   private validationErrors: ValidationError[];

    public constructor(report: any) {
        if (report.conforms()) {
            this.conforming = true;
            this.validationErrors = new Array(0);
        } else {
            this.conforming = false;
            var counter = 0;
            var numberOfErrors = report.results().length;
            this.validationErrors = new Array(numberOfErrors);
            let self = this;
            report.results().forEach(function (result: any) {
                let validationError = new ValidationError(result.message(), result.path(),
                                                          result.sourceConstraintComponent(), result.focusNode());
                self.validationErrors[counter] = validationError;
                counter++;
            });
        }
    }

    public isConforming(): boolean {
        return this.conforming;
    }

    public getValidationErrors(): ValidationError[] {
        return this.validationErrors;
    }

    public toString() {
        for (let error of this.validationErrors) {
            console.log(error.toString());
        }
    }

}
