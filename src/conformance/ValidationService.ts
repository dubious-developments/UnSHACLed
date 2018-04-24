import * as Collections from "typescript-collections";
import * as Immutable from "immutable";
import { Model, ModelData } from "../entities/model";
import { WellDefinedSHACLValidator } from "./SHACLValidator";
import { Validator } from "./Validator";
import { ModelComponent, ModelTaskMetadata } from "../entities/modelTaskMetadata";
import { Task } from "../entities/task";
import { Component } from "../persistence/component";
import { ValidationReport } from "./wrapper/ValidationReport";

/**
 * A ValidationService is a managing entity, governing various registered validators.
 */
export class ValidationService {

    private model: Model;
    private validators: Collections.Dictionary<ModelComponent, Collections.Set<Validator>>;

    /**
     * Create a new ValidationService.
     * @param {Model} model
     */
    constructor(model: Model) {
        this.model = model;
        this.validators = new Collections.Dictionary<ModelComponent, Collections.Set<Validator>>();

        this.registerValidator(new WellDefinedSHACLValidator());

        let self = this;
        model.registerObserver(function (changeBuffer: Immutable.Set<ModelComponent>) {
            let tasks = new Array<ValidationTask>();
            let relevantValidators = new Collections.Set<Validator>();
            // return a task for every relevant validator
            changeBuffer.toArray().forEach(c => {
                let validators;
                if (validators = self.validators.getValue(c)) {
                    validators.forEach(v => {
                        if (!relevantValidators.contains(v)) {
                            tasks.push(new ValidationTask(v, self.model));
                            relevantValidators.add(v);
                        }
                    });
                }
            });
            return tasks;
        });
    }

    /**
     * Register a new validator with this service by adding it to all relevant types.
     * @param {Validator} validator
     */
    public registerValidator(validator: Validator): void {
        validator.getTypesForValidation().toArray().forEach(type => {
            let relevantSet = this.validators.getValue(type);
            if (!relevantSet) {
                relevantSet = new Collections.Set<Validator>();
            }
            relevantSet.add(validator);
            this.validators.setValue(type, relevantSet);
        });
    }

}

/**
 * A Task that performs validation for a given
 * validator and stores the result in the Model.
 */
class ValidationTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new ValidationTask.
     * @param {Validator} validator
     * @param model
     */
    public constructor(
        private readonly validator: Validator,
        private readonly model: Model) {
        super();
    }

    /**
     * Execute this task.
     * Performs validation for a given validator
     * and updates the Validation Report in the Model.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        let self = this;
        this.validator.validate(data, function (report: ValidationReport) {
            // schedules a new task that will finish the validation process
            self.model.tasks.schedule(new CompleteValidationTask(report));
        });
    }

    /**
     * Retrieve the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            this.validator.getTypesForValidation(),
            this.validator.getTypesForValidation());
    }
}

/**
 * A task that finishes the validation process initiated by a validation task.
 */
class CompleteValidationTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new CompleteValidationTask.
     * @param report
     */
    public constructor(
        private readonly report: ValidationReport) {
        super();
    }

    /**
     * Execute this task.
     * Finishes validation by storing the report in the model.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        let component = data.getOrCreateComponent<Component<ValidationReport>>(
            ModelComponent.ValidationReport,
            () => new Component());

        data.setComponent(ModelComponent.ValidationReport, component.withRoot(this.report));
    }

    /**
     * Retrieve the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [],
            [ModelComponent.ValidationReport]);
    }

}