import * as Collections from "typescript-collections";
import {Model, ModelData} from "../entities/model";
import {WellDefinedSHACLValidator} from "./SHACLValidator";
import {Validator} from "./Validator";
import {ModelComponent, ModelTaskMetadata} from "../entities/modelTaskMetadata";
import {Task} from "../entities/task";
import {ValidationReport} from "./ValidationReport";
import {Component} from "../persistence/component";

/**
 * A ValidationService is a managing entity, governing various registered validators.
 */
export class ValidationService {

    private model: Model;
    private validators: Collections.Dictionary<ModelComponent, Collections.Set<Validator>>;

    /**
     * Creates a new ValidationService.
     * @param {Model} model
     */
    constructor(model: Model) {
        this.model = model;
        this.validators = new Collections.Dictionary<ModelComponent, Collections.Set<Validator>>();

        this.registerValidator(new WellDefinedSHACLValidator());

        let self = this;
        model.registerObserver(function(changeBuffer: Collections.Set<ModelComponent>) {
            let tasks = new Collections.Set<ValidationTask>();
            let relevantValidators = new Collections.Set<Validator>();
            // return a task for every relevant validator
            changeBuffer.forEach(c => {
                let validators;
                if (validators = self.validators.getValue(c)) {
                    validators.forEach(v => {
                        if (!relevantValidators.contains(v)) {
                            tasks.add(new ValidationTask(v));
                            relevantValidators.add(v);
                        }
                    });
                }
            });
            return tasks.toArray();
        });
    }

    /**
     * Register a new validator with this service by adding it to all relevant types.
     * @param {Validator} validator
     */
    public registerValidator(validator: Validator): void {
        validator.getTypesForValidation().forEach(type => {
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
        this.validator.validate(data, function(report: ValidationReport) {
            // add new report to component
            let component = data.getOrCreateComponent<Component>(
                ModelComponent.ValidationReport,
                () => new Component());
            component.setPart(toString(), report);

            // merge new report into root report
            let root = component.getOrCreateRoot(() => new ValidationReport());
            root.merge(report);
            component.setRoot(root);

            data.setComponent(ModelComponent.ValidationReport, component);
        });
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