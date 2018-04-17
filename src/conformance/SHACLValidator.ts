import * as Collections from "typescript-collections";
import SHACLValidator from "../conformance/shacl/index.js";
import {Validator} from "./Validator";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";
import {Component} from "../persistence/component";
import {Graph} from "../persistence/graph";
import {GraphParser} from "../persistence/graphParser";
import {ValidationReport} from "./wrapper/ValidationReport";

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

    /**
     * Retrieve the types relevant for this validator.
     * @returns {Set<ModelComponent>}
     */
    public getTypesForValidation(): Collections.Set<ModelComponent> {
        return this.types;
    }

    /**
     * Perform the routine validation operation.
     * @param {ModelData} data
     * @param {((report: ValidationReport) => void) | null} andThen
     */
    public validate(data: ModelData, andThen: ((report: ValidationReport) => void) | null): void {
        let dataComponent = data.getOrCreateComponent<Component>(
            ModelComponent.DataGraph,
            () => new Component());

        let shapesComponent = data.getOrCreateComponent<Component>(
            ModelComponent.SHACLShapesGraph,
            () => new Component());

        let dataRoot = new Graph();
        let shapesRoot = new Graph();

        dataComponent.getParts().forEach(g => dataRoot.merge(g));
        shapesComponent.getParts().forEach(g => shapesRoot.merge(g));

        dataComponent.setRoot(dataRoot);
        shapesComponent.setRoot(shapesRoot);

        let parser = new GraphParser();

        let self = this;
        // TODO: make sure that this double serialization is no longer necessary
        parser.serialize(dataRoot, "text/turtle", function(datastring: string) {
            parser.serialize(shapesRoot, "text/turtle", function (shapesstring: string) {
                self.doValidation(datastring, shapesstring, andThen);
            });
        });
    }

    /**
     * Do the actual validation operation.
     * @param data
     * @param shapes
     * @param {((report: ValidationReport) => void) | null} andThen
     */
    public doValidation(data: string, shapes: string, andThen: ((report: ValidationReport) => void) | null): void {
        let validator = new SHACLValidator();
        validator.validate(data, 'text/turtle', shapes, 'text/turtle', function (error: any, report: any) {
            if (andThen) {
                andThen(new ValidationReport(report));
            }
        });
    }

    /**
     * Return an identifier for this type of validator.
     * @returns {string}
     */
    public toString() {
        return "SHACLValidator";
    }
}