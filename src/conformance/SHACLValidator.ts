import * as Immutable from "immutable";
import SHACLValidator from "../conformance/shacl/index.js";
import { Validator } from "./Validator";
import { ModelData } from "../entities/model";
import { ModelComponent } from "../entities/modelTaskMetadata";
import { Component } from "../persistence/component";
import { Graph, ImmutableGraph } from "../persistence/graph";
import { ValidationReport } from "./ValidationReport";
import { GraphParser } from "../persistence/graphParser";

/**
 * A wrapper class around the shacl.js library.
 */
export class WellDefinedSHACLValidator implements Validator {

    private types: Immutable.Set<ModelComponent>;

    /**
     * Create a new WellDefinedSHACLValidator.
     */
    public constructor() {
        this.types = Immutable.Set<ModelComponent>([
            ModelComponent.DataGraph,
            ModelComponent.SHACLShapesGraph
        ]);
    }

    /**
     * Retrieve the types relevant for this validator.
     */
    public getTypesForValidation(): Immutable.Set<ModelComponent> {
        return this.types;
    }

    /**
     * Perform a routine validation operation.
     * @param {ModelData} data
     * @param {((report: ValidationReport) => void) | null} andThen
     */
    public validate(data: ModelData, andThen: ((report: ValidationReport) => void) | null): void {
        let dataComponent = data.getOrCreateComponent<Component<ImmutableGraph>>(
            ModelComponent.DataGraph,
            () => new Component<ImmutableGraph>());

        let shapesComponent = data.getOrCreateComponent<Component<ImmutableGraph>>(
            ModelComponent.SHACLShapesGraph,
            () => new Component<ImmutableGraph>());

        if (!dataComponent.getRoot()) {
            dataComponent = dataComponent.withRoot((new Graph()).asImmutable());
        }

        if (!shapesComponent.getRoot()) {
            shapesComponent = shapesComponent.withRoot((new Graph()).asImmutable());
        }

        let dataRoot = dataComponent.getRoot().toMutable();
        let shapesRoot = shapesComponent.getRoot().toMutable();

        // perform a more intelligent merge, using change sets
        // WARNING: this approach assumes (rightly, at the moment) that no other component
        // is clearing the change sets of any graph structures
        dataComponent.getCompositeParts().forEach(p => {
            let key = p[0];
            let graph = p[1].toMutable();
            dataRoot.incrementalMerge(graph);
            graph.clearRecentChanges(); // crucial for this to keep working
            dataComponent = dataComponent.withPart(key, graph.asImmutable());
        });

        shapesComponent.getCompositeParts().forEach(p => {
            let key = p[0];
            let graph = p[1].toMutable();
            shapesRoot.incrementalMerge(graph);
            graph.clearRecentChanges(); // crucial for this to keep working
            shapesComponent = shapesComponent.withPart(key, graph.asImmutable());
        });

        data.setComponent(ModelComponent.DataGraph, dataComponent.withRoot(dataRoot.asImmutable()));
        data.setComponent(ModelComponent.SHACLShapesGraph, shapesComponent.withRoot(shapesRoot.asImmutable()));

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
        parser.serialize(data, 'text/turtle', function (dataText: string) {
            parser.serialize(shapes, 'text/turtle', function (shapesText: string) {
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
     */
    public toString(): string {
        return "SHACLValidator";
    }
}