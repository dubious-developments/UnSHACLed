import * as Collections from "typescript-collections";
import SHACLValidator from "../conformance/shacl/index.js";
import {Validator} from "./Validator";
import {ModelData} from "../entities/model";
import {ModelComponent} from "../entities/modelTaskMetadata";
import {Component} from "../persistence/component";
import {Graph} from "../persistence/graph";
import {ValidationReport} from "./wrapper/ValidationReport";
import {GraphParser} from "../persistence/graphParser";

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
        let dataComponent = data.getOrCreateComponent<Component<Graph>>(
            ModelComponent.DataGraph,
            () => new Component<Graph>());

        let shapesComponent = data.getOrCreateComponent<Component<Graph>>(
            ModelComponent.SHACLShapesGraph,
            () => new Component<Graph>());

        if (!dataComponent.getRoot()) {
            dataComponent = dataComponent.withRoot(new Graph());
        }

        if (!shapesComponent.getRoot()) {
            shapesComponent = shapesComponent.withRoot(new Graph());
        }

        let dataRoot = dataComponent.getRoot();
        let shapesRoot = shapesComponent.getRoot();

        // perform a more intelligent merge, using change sets
        // WARNING: this approach assumes (rightly, at the moment) that no other component
        // is clearing the change sets of any graph structures
        dataComponent.getCompositeParts().forEach(g => {
            dataRoot.incrementalMerge(g);
            g.clearRecentChanges(); // crucial for this to keep working
        });

        shapesComponent.getCompositeParts().forEach(g => {
            shapesRoot.incrementalMerge(g);
            g.clearRecentChanges(); // crucial for this to keep working
        });

        data.setComponent(ModelComponent.DataGraph, dataComponent.withRoot(dataRoot));
        data.setComponent(ModelComponent.SHACLShapesGraph, shapesComponent.withRoot(shapesRoot));

        this.doValidation(dataRoot, shapesRoot, andThen);
    }

    /**
     * Do the actual validation operation.
     * @param data
     * @param shapes
     * @param {((report: ValidationReport) => void) | null} andThen
     */
    public doValidation(data: Graph, shapes: Graph, andThen: ((report: ValidationReport) => void) | null): void {
        let parser = new GraphParser();
        parser.serialize(data, 'text/turtle', function(dataText: string) {
            parser.serialize(shapes, 'text/turtle', function(shapesText: string) {
                let validator = new SHACLValidator();
                validator.validate(dataText, 'text/turtle', shapesText, 'text/turtle',
                                   function (error: any, report: any) {
                    if (andThen) {
                        andThen(new ValidationReport(report));
                    }
                });
            });
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