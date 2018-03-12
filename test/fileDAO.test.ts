import {Model, ModelComponent, ModelData, ModelTaskMetadata} from "../src/entities/model";
import {FileDAO, FileModule} from "../src/persistence/fileDAO";
import {DataGraphModem} from "../src/persistence/dataGraphModem";
import {Component} from "../src/persistence/component";
import {ProcessorTask} from "../src/entities/taskProcessor";

describe("FileDAO Class", () => {
    it("Should create a new file.",
       () => {
            let label = ModelComponent.DataGraph;
            let filename = "insert.ttl";
            let file = new Blob([], {type: "text/turtle"});
            let module = new FileModule(label, filename, file);

            let model = new Model();
            let modem = new DataGraphModem();
            let comp = new Component();
            let done = false;
            comp.setPart(filename, modem.demodulate(generateTurtle(), file.type));
            model.tasks.schedule(new ProcessorTask<ModelData, ModelTaskMetadata>(
                (data) => {
                    data.setComponent(ModelComponent.DataGraph, comp);
                    done = true;
                    },
                null)
            );
            model.tasks.processTask();

            // this is pretty horrible and there probably exists a better way of doing this,
            // but at the moment I can't seem to think of one
            while (!done) {}

            // no idea how to automatically check whether the file was actually created,
            // as this would require rummaging the user's file system
            let dao = new FileDAO(model);
            dao.insert(module);
        });

    it("Should load an existing file.",
       () => {
           let label = ModelComponent.DataGraph;
           let filename = "find.ttl";
           let file = new Blob([generateTurtle()], {type: "text/turtle"});
           let module = new FileModule(label, filename, file);

           let model = new Model();
           model.registerObserver((changeBuf) => {
               expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
               return [];
           });

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