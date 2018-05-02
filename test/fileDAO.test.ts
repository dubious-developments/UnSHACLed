import {Model, ModelObserver} from "../src/entities/model";
import { ModelComponent } from "../src/entities/modelTaskMetadata";
import { FileDAO, FileModule } from "../src/persistence/fileDAO";
import { GraphParser } from "../src/persistence/graphParser";
import { Component } from "../src/persistence/component";
import { Graph, ImmutableGraph } from "../src/persistence/graph";

describe("FileDAO Class", () => {
    it("should create a new file.",
       (done) => {
            let label = ModelComponent.DataGraph;
            let filename = "insert.ttl";
            let file = new Blob([]); // blob is unnecessary for saving to file
            let module = new FileModule(label, filename, file);

            let model = new Model();
            let parser = new GraphParser();
            let comp = new Component<ImmutableGraph>();
            let busy = true;

            parser.parse(generateTurtle(), module.getMime(), function(result: Graph) {
                comp = comp.withPart(filename, result.asImmutable());
                model.tasks.schedule(
                    Model.createTask(
                        (data) => {
                            data.setComponent(ModelComponent.DataGraph, comp);
                            busy = false;
                        },
                        [],
                        [ModelComponent.DataGraph]));
                model.tasks.processTask();

                // this is pretty horrible and there probably exists a better way of doing this,
                // but at the moment I can't seem to think of one
                while (busy) {}

                // no idea how to automatically check whether the file was actually created,
                // as this would require rummaging the user's file system
                let dao = new FileDAO(model);
                dao.insert(module);
                done();
            });
        });

    it("should load an existing file.",
       (done) => {
           let label = ModelComponent.DataGraph;
           let filename = "find.ttl";
           let file = new Blob([generateTurtle()]);
           let module = new FileModule(label, filename, file);

           let model = new Model();
           model.registerObserver(new ModelObserver((changeBuf) => {
               expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
               done();
               return [];
           }));

           let dao = new FileDAO(model);
           dao.find(module);
       });
});

function generateTurtle() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}