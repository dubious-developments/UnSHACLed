import * as Collections from "typescript-collections";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";
import {ConformanceReport} from "./wrapper/ConformanceReport";

export interface Validator {
    getTypesForValidation(): Collections.Set<ModelComponent>;
    validate(data: ModelData, andThen: ((report: ConformanceReport) => void) | null): void;
}