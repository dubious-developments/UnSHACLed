import * as Immutable from "immutable";
import { ModelData } from "../entities/model";
import { ModelComponent } from "../entities/modelTaskMetadata";
import { ValidationReport } from "./ValidationReport";

export interface Validator {
    /**
     * Retrieve the types relevant for this validator.
     */
    getTypesForValidation(): Immutable.Set<ModelComponent>;

    /**
     * Perform a routine validation operation.
     * @param {ModelData} data
     * @param {((report: ValidationReport) => void) | null} andThen
     */
    validate(data: ModelData, andThen: ((report: ValidationReport) => void) | null): void;
}