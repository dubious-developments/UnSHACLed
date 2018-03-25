/// <reference path="./Validator.d.ts"/>

import * as Collections from "typescript-collections";
import {Model, ModelData} from "../entities/model";
import {SHACLValidator} from "./SHACLValidator";
import {Validator} from "./Validator";
import {ModelComponent, ModelTaskMetadata} from "../entities/modelTaskMetadata";
import {Component} from "../persistence/component";
import {Task} from "../entities/task";

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
                let validatorSet;
                if (validatorSet = self.validators.getValue(c)) {
                    validatorSet.forEach(v => {
                        if (!relevantValidators.contains(v)) {
                            tasks.push(new ValidationTask(v));
                            relevantValidators.add(v);
                        }
                    });
                }
            });
            return tasks;
        });
    }

    public registerValidator(validator: Validator): void {
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

class ValidationTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Creates a new ValidationTask.
     * @param {Validator} validator
     */
    public constructor(
        private readonly validator: Validator) {
        super();
    }

    /**
     * Executes this task.
     * Performs validation for a given validator
     * and updates the Validation Report in the Model.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        this.validator.validate(data);
    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            this.validator.getTypesForValidation(),
            [ModelComponent.ValidationReport]);
    }
}