/// <reference path="./Validator.d.ts"/>

import * as Collections from "typescript-collections";
import SHACL from "./shacl";
import {Validator} from "./Validator";
import {ModelComponent, ModelData} from "../entities/model";

export class SHACLValidator implements Validator {

    private types: Collections.Set<ModelComponent>;

    public SHACLValidator() {
        this.types = new Collections.Set<ModelComponent>();
        this.types.add(ModelComponent.DataGraph);
        this.types.add(ModelComponent.SHACLShapesGraph);
    }

    public getTypesForValidation() {
        return this.types;
    }

    public validate(data: ModelData) {
        let validator = new SHACL();
    }
}