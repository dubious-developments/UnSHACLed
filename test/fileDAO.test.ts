import {Model, ModelObserver} from "../src/entities/model";
import { ModelComponent } from "../src/entities/modelTaskMetadata";
import { FileDAO, FileModule, IOFacilitator } from "../src/persistence/fileDAO";
import { GraphParser } from "../src/persistence/graphParser";
import { Component } from "../src/persistence/component";
import { Graph, ImmutableGraph } from "../src/persistence/graph";
import {WorkspaceParser} from "../src/persistence/workspaceParser";

describe("IOFacilitator Class", () => {

    it("should be able to register parsers.",
        () => {
            let io = new IOFacilitator();
            io.registerParser(ModelComponent.DataGraph, new GraphParser());
            expect(io.getParsers().getValue(ModelComponent.DataGraph)).toBeDefined();
        }
    );

    it("should read from file.",
        (done) => {
            let label = ModelComponent.DataGraph;
            let filename = "read.ttl";
            let file = new Blob([generateTurtle()]);
            let module = new FileModule(label, filename, file);

            let io = new IOFacilitator();
            io.registerParser(ModelComponent.DataGraph, new GraphParser());
            io.readFromFile(module, result => {
                expect(result).toBeDefined();
                expect(result instanceof Graph).toEqual(true);
                done();
            });
        }
    );

    it("should write to file.",
        (done) => {
            let label = ModelComponent.DataGraph;
            let filename = "write.ttl";
            let file = new Blob([]);
            let module = new FileModule(label, filename, file);

            let io = new IOFacilitator();
            io.registerParser(ModelComponent.DataGraph, new GraphParser());
            let parser = new GraphParser();
            parser.parse(generateTurtle(), "text/turtle", result => {
                io.writeToFile(module, result);
                done();
            });
        }
    );
});

describe("FileDAO Class", () => {
    it("should create a new file containing a graph.",
       (done) => {
            let label = ModelComponent.DataGraph;
            let filename = "insert.ttl";
            let file = new Blob([]); // blob is unnecessary for saving to file
            let module = new FileModule(label, filename, file);

            let model = new Model();
            let parser = new GraphParser();
            let comp = new Component<ImmutableGraph>();
            let busy = true;

            parser.parse(generateTurtle(), "text/turtle", function(result: Graph) {
                comp = comp.withPart(filename, result.asImmutable());
                model.tasks.schedule(
                    Model.createTask(
                        (data) => {
                            data.setComponent(ModelComponent.DataGraph, comp);
                            busy = false;
                        },
                        [],
                        [ModelComponent.DataGraph]));
                model.tasks.processAllTasks();

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

    it("should load an existing file containing a graph.",
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

    it("should create a new file containing a workspace.",
        (done) => {
            let label = ModelComponent.Workspace;
            let filename = "insert_ws.json";
            let file = new Blob([]); // blob is unnecessary for saving to file
            let module = new FileModule(label, filename, file);

            let model = new Model();
            let parser = new GraphParser();
            let comp = new Component<ImmutableGraph>();
            let busy = true;

            parser.parse(generateTurtle(), "text/turtle", function(result: Graph) {
                comp = comp.withPart(filename, result.asImmutable());
                model.tasks.schedule(
                    Model.createTask(
                        (data) => {
                            data.setComponent(ModelComponent.DataGraph, comp);
                            busy = false;
                        },
                        [],
                        [ModelComponent.DataGraph]));
                model.tasks.processAllTasks();

                // this is pretty horrible and there probably exists a better way of doing this,
                // but at the moment I can't seem to think of one
                while (busy) {}

                // no idea how to automatically check whether the file was actually created,
                // as this would require rummaging the user's file system
                let dao = new FileDAO(model);
                dao.insertWorkspace(module);
                done();
            });
        }
    );

    it("should load an existing file containing a workspace.",
        (done) => {
            let label = ModelComponent.Workspace;
            let filename = "find_ws.json";
            let file = new Blob([generateJSON()]);
            let module = new FileModule(label, filename, file);

            let model = new Model();
            model.registerObserver(new ModelObserver((changeBuf) => {
                expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
                expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
                expect(changeBuf.contains(ModelComponent.IO)).toEqual(true);
                done();
                return [];
            }));

            let dao = new FileDAO(model);
            dao.findWorkspace(module);
        }
    );
});

function generateTurtle() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}

function generateJSON() {
    return '{\n' +
        '  "SHACLShapesGraph": [],\n' +
        '  "DataGraph": [\n' +
        '    {\n' +
        '      "id": "insert_ws.json",\n' +
        '      "triples": [\n' +
        '        {\n' +
        '          "subject": "http://en.wikipedia.org/wiki/Tony_Benn",\n' +
        '          "predicate": "http://purl.org/dc/elements/1.1/title",\n' +
        '          "object": "Tony Benn"\n' +
        '        },\n' +
        '        {\n' +
        '          "subject": "http://en.wikipedia.org/wiki/Tony_Benn",\n' +
        '          "predicate": "http://purl.org/dc/elements/1.1/publisher",\n' +
        '          "object": "Wikipedia"\n' +
        '        }\n' +
        '      ],\n' +
        '      "prefixes": [\n' +
        '        {\n' +
        '          "prefix": "dc",\n' +
        '          "iri": "http://purl.org/dc/elements/1.1/"\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "IO": []\n' +
        '}';
}