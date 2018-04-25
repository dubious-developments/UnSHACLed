import * as Collections from "typescript-collections";
import * as Immutable from "immutable";
import {Model, ModelData, ModelObserver} from "../entities/model";
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
    private buffer: TaskCompletionBuffer;
    private validators: Collections.Dictionary<ModelComponent, Collections.Set<Validator>>;

    /**
     * Create a new ValidationService.
     * @param {Model} model
     */
    public constructor(model: Model) {
        this.model = model;
        this.buffer = new TaskCompletionBuffer();
        this.validators = new Collections.Dictionary<ModelComponent, Collections.Set<Validator>>();

        this.registerValidator(new WellDefinedSHACLValidator());

        let self = this;
        model.registerObserver(new ModelObserver(
            function (changeBuffer: Immutable.Set<ModelComponent>) {
            let tasks = new Array<ValidationTask>();
            let relevantValidators = new Collections.Set<Validator>();
            // return a task for every relevant validator
            changeBuffer.toArray().forEach(c => {
                let validators;
                if (validators = self.validators.getValue(c)) {
                    validators.forEach(v => {
                        if (!relevantValidators.contains(v)) {
                            tasks.push(new ValidationTask(v, self.model, self.buffer));
                            relevantValidators.add(v);
                        }
                    });
                }
            });
            return tasks;
        }));
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
 * A buffer containing pending tasks that are in need of completion.
 * This class serializes the completions of these pending tasks, meaning that the completions
 * will be performed in the same order that the pending tasks themselves entered the buffer.
 */
export class TaskCompletionBuffer {

    private queue: Collections.PriorityQueue<PendingTask>;

    /**
     * Create a new TaskCompletionBuffer.
     */
    public constructor() {
        this.queue = new Collections.PriorityQueue<PendingTask>(function(a: PendingTask, b: PendingTask) {
            // having a "larger" timestamp means having a lower priority
            if (a.getTimeStamp() > b.getTimeStamp()) {
                return -1;
            } else if (a.getTimeStamp() < b.getTimeStamp()) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Adds a new pending task to the buffer and returns a function that can be called at
     * the opportune moment to complete the pending task.
     * @param {(task: Task<ModelData, ModelTaskMetadata>) => void} onComplete
     * @returns {(task: Task<ModelData, ModelTaskMetadata>) => void}
     */
    public waitForCompletion(onComplete: (task: Task<ModelData, ModelTaskMetadata>) => void):
               (task: Task<ModelData, ModelTaskMetadata>) => void {
        let pending = new PendingTask();
        this.queue.add(pending);
        let self = this;
        return function(task: Task<ModelData, ModelTaskMetadata>) {
            // marks the pending task as ready for completion
            pending.prepareForCompletion(task, onComplete);

            // completes as many tasks as possible
            let head;
            while ((head = self.queue.peek()) && !head.isPending()) {
                head.complete();
                self.queue.dequeue();
            }
        };
    }
}

/**
 * A task pending completion.
 */
export class PendingTask {

    private pending: boolean;
    private timestamp: number;

    /**
     * The task responsible for completing this pending task.
     */
    private task: Task<ModelData, ModelTaskMetadata>;

    /**
     * The function that will complete this pending task.
     */
    private onComplete: (task: Task<ModelData, ModelTaskMetadata>) => void;

    /**
     * Create a new PendingTask.
     */
    public constructor() {
        this.pending = true;
        this.timestamp = performance.timing.navigationStart + performance.now();
    }

    /**
     * Check whether the task is still pending.
     * @returns {boolean}
     */
    public isPending(): boolean {
        return this.pending;
    }

    /**
     * Prepare this pending task for completion, i.e. mark as no longer pending and provide
     * the task and function that will be used to complete this task.
     * @param {Task<ModelData, ModelTaskMetadata>} task
     * @param {(task: Task<ModelData, ModelTaskMetadata>) => void} onComplete
     */
    public prepareForCompletion(task: Task<ModelData, ModelTaskMetadata>,
                                onComplete: (task: Task<ModelData, ModelTaskMetadata>) => void): void {
        this.pending = false;
        this.task = task;
        this.onComplete = onComplete;
    }

    /**
     * Retrieve the time at which this task was created.
     * @returns {number}
     */
    public getTimeStamp(): number {
        return this.timestamp;
    }

    /**
     * If this task is ready for completion, complete the task.
     */
    public complete() {
        if (!this.isPending()) {
            this.onComplete(this.task);
        }
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
     * @param buffer
     */
    public constructor(
        private readonly validator: Validator,
        private readonly model: Model,
        private readonly buffer: TaskCompletionBuffer) {
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
        let complete = this.buffer.waitForCompletion(function(task: Task<ModelData, ModelTaskMetadata>) {
            // schedules a new task that will finish the validation process
            self.model.tasks.schedule(task);
        });

        this.validator.validate(data, function (report: ValidationReport) {
            complete(new CompleteValidationTask(report));
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
            [ModelComponent.ValidationReport],
            [ModelComponent.ValidationReport]);
    }

}