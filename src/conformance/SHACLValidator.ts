/// <reference path="./Validator.d.ts"/>

import * as Collections from "typescript-collections";
import {Validator} from "./Validator";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";
import {ValidationReport} from "./ValidationReport";

export class SHACLValidator implements Validator {

    private types: Collections.Set<ModelComponent> | Array<ModelComponent>;

    public constructor() {
        this.types = [ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph];
    }

    public getTypesForValidation(): Collections.Set<ModelComponent> | Array<ModelComponent> {
        return this.types;
    }

    public validate(data: ModelData): ValidationReport {
        return new ValidationReport();
    }
}