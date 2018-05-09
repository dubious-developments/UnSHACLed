/**
 * A validation error reported by the SHACL validator.
 */
export class ValidationError {

    private message: string;
    private shapeProperty: string;
    private shapeConstraint: string;
    private dataElement: string;

    /** Example: the data value bob (focusNode) does not conform because ssn (path) does not oblige to MaxCount:1
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

    /**
     * Retrieve the string representation of this validation report.
     * @returns {string}
     */
    public toString(): string {
        return "The data value: " + this.dataElement + ", does not conform because: " + this.shapeProperty +
            "does not oblige to: " + this.shapeConstraint;
    }

    /**
     * Retrieve the message contained within this validation report.
     * @returns {string}
     */
    public getMessage(): string {
        return this.message;
    }

    /**
     * Retrieve the shape property contained within this validation report.
     * @returns {string}
     */
    public getShapeProperty(): string {
        return this.shapeProperty;
    }

    /**
     * Retrieve the shapes constraint contained within this validation report.
     * @returns {string}
     */
    public getShapeConstraint(): string {
        return this.shapeConstraint;
    }

    /**
     * Retrieve the data element contained within this validation report.
     * @returns {string}
     */
    public getDataElement(): string {
        return this.dataElement;
    }

}

/**
 * A validation report indicating whether or not the active data is conforming to the active shapes.
 * If this is not the case, the report contains validation errors indicating where the data does not conform.
 */
export class ValidationReport {

    private conforming: boolean;
    private validationErrors: ValidationError[];

    /**
     * Create a new Validation Report based on a library-specific report.
     * @param report
     */
    public constructor(report: any) {
        if (report.conforms()) {
            this.conforming = true;
            this.validationErrors = new Array(0);
        } else {
            this.conforming = false;
            this.validationErrors = new Array(report.results().length);

            let counter = 0;
            let self = this;
            report.results().forEach(function (result: any) {
                self.validationErrors[counter++] =
                    new ValidationError(result.message(), result.path(),
                                        result.sourceConstraintComponent(), result.focusNode());
            });
        }
    }

    /**
     * Whether or not the active is conforming.
     * @returns {boolean}
     */
    public isConforming(): boolean {
        return this.conforming;
    }

    /**
     * Retrieve all the validation errors contained within this report.
     * @returns {ValidationError[]}
     */
    public getValidationErrors(): ValidationError[] {
        return this.validationErrors;
    }

    /**
     * Retrieve the string representation of this validation report.
     */
    public toString() {
        for (let error of this.validationErrors) {
            console.log(error.toString());
        }
    }

}
