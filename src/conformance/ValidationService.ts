/// <reference path="./Validator.d.ts"/>

import * as Collections from "typescript-collections";
import {Model, ModelComponent, ModelData, ModelTaskMetadata} from "../entities/model";
import {ProcessorTask} from "../entities/taskProcessor";
import {SHACLValidator} from "./SHACLValidator";
import {Validator} from "./Validator";

export class ValidationService {

    private model: Model;
    private validators: Collections.Dictionary<ModelComponent, Collections.Set<Validator>>;

    constructor(model: Model) {
        this.model = model;
        this.validators = new Collections.Dictionary<ModelComponent, Collections.Set<Validator>>();

        this.registerValidator(new SHACLValidator());

        let self = this;
        model.registerObserver(function(changeBuffer: Collections.Set<ModelComponent>) {
            let tasks = [];
            let relevantValidators = new Collections.Set<Validator>();
            // return a task for every relevant validator
            changeBuffer.forEach(c => {
                self.validators.getValue(c).forEach(v => {
                    if (!relevantValidators.contains(v)) {
                        tasks.push(new ValidationTask(v));
                        relevantValidators.add(v);
                    }
                });
            });
            return tasks;
        });
    }

    public registerValidator(validator: Validator) {
        validator.getTypesForValidation().forEach(c => {
            let relevantSet = this.validators.getValue(c);
            if (!relevantSet) {
                relevantSet = new Collections.Set<Validator>();
            }
            relevantSet.add(validator);
            this.validators.setValue(c, relevantSet);
        });
    }

}

class ValidationTask extends ProcessorTask<ModelData, ModelTaskMetadata> {
    public constructor(validator: Validator) {
        super(function(data: ModelData) {
            validator.validate(data);
        },    null);
    }
}