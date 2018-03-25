import * as Collections from "typescript-collections";
import {Validator} from "./Validator";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";
import {ValidationReport} from "./ValidationReport";
import {Component} from "../persistence/component";
import {Graph} from "../persistence/graph";

/**
 * A wrapper class around the shacl.js library.
 */
export class WellDefinedSHACLValidator implements Validator {

    private types: Collections.Set<ModelComponent>;

    /**
     * Create a new WellDefinedSHACLValidator.
     */
    public constructor() {
        this.types = new Collections.Set<ModelComponent>();
        this.types.add(ModelComponent.DataGraph);
        this.types.add(ModelComponent.SHACLShapesGraph);
    }

    public getTypesForValidation(): Collections.Set<ModelComponent> {
        return this.types;
    }

    public validate(data: ModelData, andThen: (report: ValidationReport) => void): void {
        let dataComponent = data.getOrCreateComponent<Component>(
            ModelComponent.DataGraph,
            () => new Component());

        let shapesComponent = data.getOrCreateComponent<Component>(
            ModelComponent.SHACLShapesGraph,
            () => new Component());

        // TODO: Possible optimisation => do validation over those parts that are actually changed
        let dataRoot = <Graph> dataComponent.getOrCreateRoot(() => new Graph());
        let shapesRoot = <Graph> shapesComponent.getOrCreateRoot(() => new Graph());

        // very odd, somehow this is needed instead of
        // a regular import statement (which works in the test files)
        let SHACLValidator = require("./shacl");
        let validator = new SHACLValidator(dataRoot.getSHACLStore(), shapesRoot.getSHACLStore());
        validator.updateValidationEngine();
        validator.showValidationResults(function (err: any, report: any) {
            andThen(new ValidationReport());
        });
    }
}