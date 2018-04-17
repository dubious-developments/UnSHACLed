import * as Collections from "typescript-collections";
import {Model, ModelData} from "../entities/model";
import {WellDefinedSHACLValidator} from "./SHACLValidator";
import {Validator} from "./Validator";
import {ModelComponent, ModelTaskMetadata} from "../entities/modelTaskMetadata";
import {Task} from "../entities/task";
import {Component} from "../persistence/component";
import {ValidationReport} from "./wrapper/ValidationReport";

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
     * Create a new ValidationTask.
     * @param {Validator} validator
     */
    public constructor(
        private readonly validator: Validator) {
        super();
    }

    /**
     * Execute this task.
     * Performs validation for a given validator
     * and updates the Validation Report in the Model.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        // first set the component here
        // because setting it in the callback gives weird errors
        let component = data.getOrCreateComponent<Component>(
            ModelComponent.ValidationReport,
            () => new Component());

        this.validator.validate(data, function(report: ValidationReport) {
            // We use toString() to save the report with the type of validator that generated the report
            component.setPart(toString(), report);

            // TODO: merge new report into root report
            // let root = component.getOrCreateRoot(() => new ConformanceReport());
            // root.merge(report);
            component.setRoot(report);
            data.setComponent(ModelComponent.ValidationReport, component);
        });
    }

    /**
     * Retrieve the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            this.validator.getTypesForValidation(),
            [ModelComponent.ValidationReport]);
    }
}