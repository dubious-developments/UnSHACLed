/**
 * Created by Matthias on 12-Apr-18.
 */
import SHACLValidator from "../../conformance/shacl/index.js";


export class ValidationError{

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
    constructor(message: string, shapeProperty: string, shapeConstraint: string, dataElement: string){
        this.message = message;
        this.shapeProperty = shapeProperty;
        this.shapeConstraint = shapeConstraint;
        this.dataElement = dataElement;
    }

    public toString(): string{
        return "The data value: " + this.dataElement + ", does not conform because: " + this.shapeProperty +
            "does not oblige to: " + this.shapeConstraint;
    }

    public getMessage(): string{
        return this.message;
    }

    public getShapeProperty(): string{
        return this.shapeProperty;
    }

    public getShapeConstraint(): string{
        return this.shapeConstraint;
    }

    public getDataElement(): string{
        return this.dataElement;
    }

}

export class ConformanceReport{

   private isConforming: boolean;
   private validationErrors: ValidationError[];

    public constructor(){
        this.isConforming = false;
    }

    public conforms(data: string, dataType: string, shapes: string, shapesType: string,
                    andThen: ((report: any) => void) | null): void{
        let validator = new SHACLValidator();
        let that = this;
        validator.validate(data, dataType, shapes, shapesType, function (e: any, report: any) {
            if(report.conforms()){
                that.isConforming = true;
                that.validationErrors = new Array(0);
            }
            else{
                that.isConforming = false;
                var counter = 0;
                var numberOfErrors = report.results().length;
                that.validationErrors = new Array(numberOfErrors);
                report.results().forEach(function (result: any) {
                    let validationError = new ValidationError(result.message(), result.path(),
                                                              result.sourceConstraintComponent(),result.focusNode());
                    that.validationErrors[counter] = validationError;
                    counter++;
                });
            }
            if (andThen) {
                andThen(that);
            }
        });
    }

    public getIsConforming():boolean{
        return this.isConforming;
    }

    public getValidationErrors():ValidationError[]{
        return this.validationErrors;
    }

    public toString(){
        for (let error of this.validationErrors) {
            console.log(error.toString());
        }
    }

}
