import * as Immutable from "immutable";
import { ModelData } from "../entities/model";
import { ModelComponent } from "../entities/modelTaskMetadata";
import { ValidationReport } from "./wrapper/ValidationReport";

export interface Validator {
    getTypesForValidation(): Immutable.Set<ModelComponent>;
    validate(data: ModelData, andThen: ((report: ValidationReport) => void) | null): void;
}