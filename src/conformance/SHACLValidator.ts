/// <reference path="./Validator.d.ts"/>

import * as Collections from "typescript-collections";
import {Validator} from "./Validator";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";

export class SHACLValidator implements Validator {

    private types: Collections.Set<ModelComponent> | Array<ModelComponent>;

    public SHACLValidator() {
        this.types = [ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph];
    }

    public getTypesForValidation() {
        return this.types;
    }

    public validate(data: ModelData) {
    }
}