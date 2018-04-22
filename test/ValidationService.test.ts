import {Model} from "../src/entities/model";
import {GraphParser} from "../src/persistence/graphParser";
import {Component} from "../src/persistence/component";
import {ValidationService} from "../src/conformance/ValidationService";
import {ModelComponent} from "../src/entities/modelTaskMetadata";
import {Graph, ImmutableGraph} from "../src/persistence/graph";

describe("ValidationService Class", () => {
    it("should add a new conformance report to model data.",
       (done) => {
           let model = new Model();
           let service = new ValidationService(model);
           let parser = new GraphParser();
           let comp1 = new Component<ImmutableGraph>();
           let comp2 = new Component<ImmutableGraph>();

           model.registerObserver((changeBuf) => {
               setTimeout(function () {
                   expect(changeBuf.contains(ModelComponent.ValidationReport)).toEqual(true);
                   done();
               },         2000);
               return [];
           });

           parser.parse(getDataGraph(), "text/turtle", function (data: Graph) {
               parser.clean();
               parser.parse(getShapesGraph(), "text/turtle", function (shapes: Graph) {
                   comp1 = comp1.withPart("test", data.asImmutable());
                   comp2 = comp2.withPart("test", shapes.asImmutable());
                   model.tasks.schedule(
                       Model.createTask(
                           (mdata) => {
                               mdata.setComponent(ModelComponent.DataGraph, comp1);
                               mdata.setComponent(ModelComponent.SHACLShapesGraph, comp2);
                           },
                           [],
                           [ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph]));
                   model.tasks.processAllTasks();
               });
           });
       });
});

function getDataGraph() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:Alice\n' +
        'a ex:Person ;\n' +
        'ex:ssn "987-65-4323" .';
}

function getShapesGraph() {
    return '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n' +
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n' +
        '@prefix sh: <http://www.w3.org/ns/shacl#>.\n' +
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n' +
        '@prefix ex: <http://example.com/ns#>.\n' +
        'ex:PersonShape \n' +
        'a sh:NodeShape ;\n' +
        'sh:targetClass ex:Person ;\n' +
        'sh:property [\n' +
        'sh:path ex:ssn ;\n' +
        'sh:maxCount 1 ;\n' +
        'sh:datatype xsd:string ;\n' +
        'sh:pattern "^\\\\d{3}-\\\\d{2}-\\\\d{4}$" ;\n' +
        '] ;\n' +
        'sh:property [\n' +
        'sh:path ex:worksFor ;\n' +
        'sh:class ex:Company ;\n' +
        'sh:nodeKind sh:IRI ;\n' +
        '] ;\n' +
        'sh:closed true ;\n' +
        'sh:ignoredProperties ( rdf:type ) .';
}