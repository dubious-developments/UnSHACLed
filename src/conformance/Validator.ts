import * as Collections from "typescript-collections";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";
import {ValidationReport} from "./wrapper/ValidationReport";

export interface Validator {
    getTypesForValidation(): Collections.Set<ModelComponent>;
    validate(data: ModelData, andThen: ((report: ValidationReport) => void) | null): void;
}