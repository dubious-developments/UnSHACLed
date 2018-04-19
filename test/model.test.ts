import { Set } from "typescript-collections";
import * as Immutable from "immutable";
import { Model, ModelData } from "../src/entities/model";
import { ModelTaskMetadata, ModelComponent } from "../src/entities/modelTaskMetadata";
import { Task, OpaqueTask } from "../src/entities/task";
import { InOrderProcessor } from "../src/entities/taskProcessor";

let graphReadSet = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
let graphWriteSet = new Set<ModelComponent>();
graphWriteSet.add(ModelComponent.DataGraph);
let graphTweakMetadata = new ModelTaskMetadata(graphReadSet, graphWriteSet);

describe("ModelTaskMetadata Class", () => {
    it("should have sensible readsFrom/writesTo implementations", () => {
        expect(graphTweakMetadata.readsFrom(ModelComponent.DataGraph)).toEqual(true);
        expect(graphTweakMetadata.writesTo(ModelComponent.DataGraph)).toEqual(true);
    });

    it("remembers its priority", () => {
       expect(new ModelTaskMetadata(graphReadSet, graphWriteSet, 1).priority).toEqual(1); 
    });

    it("has the right default priority", () => {
        expect(new ModelTaskMetadata(graphReadSet, graphWriteSet).priority)
            .toEqual(ModelTaskMetadata.defaultPriority); 
     });
});

describe("ModelData class", () => {
    it("has a working write buffer", () => {
        let data = new ModelData();
        data.setComponent(ModelComponent.DataGraph, 10);
        let buffers = data.drainBuffers();
        expect(buffers.writeBuffer.contains(ModelComponent.DataGraph)).toBeTruthy();
        expect(buffers.writeBuffer.size).toEqual(1);
        expect(data.drainBuffers().writeBuffer.size).toEqual(0);
    });

    it("has a working read buffer", () => {
        let data = new ModelData();
        data.setComponent(ModelComponent.DataGraph, 10);
        data.drainBuffers();
        let value = data.getComponent<number>(ModelComponent.DataGraph);
        let buffers = data.drainBuffers();
        expect(buffers.readBuffer.contains(ModelComponent.DataGraph)).toBeTruthy();
        expect(buffers.writeBuffer.size).toEqual(0);
        expect(data.drainBuffers().readBuffer.size).toEqual(0);
    });

    it("updates the right buffer from a getOrCreateComponent call", () => {
        let data = new ModelData();
        expect(data.getOrCreateComponent(ModelComponent.DataGraph, () => 10))
            .toEqual(10);
        let buffers = data.drainBuffers();
        expect(buffers.writeBuffer.contains(ModelComponent.DataGraph)).toBeTruthy();
        expect(buffers.writeBuffer.size).toEqual(1);
        expect(buffers.readBuffer.size).toEqual(0);
        expect(data.getOrCreateComponent(ModelComponent.DataGraph, () => 20))
            .toEqual(10);
        buffers = data.drainBuffers();
        expect(buffers.readBuffer.contains(ModelComponent.DataGraph)).toBeTruthy();
        expect(buffers.writeBuffer.size).toEqual(0);
        expect(buffers.writeBuffer.size).toEqual(0);
    });
});

describe("Model Class", () => {
    it("can be created", () => {
        new Model().registerObserver((changeBuf) => []);
    });

    it("should notify observers", () => {
        let modelData = new ModelData();
        modelData.setComponent(ModelComponent.DataGraph, 0);
        let model = new Model(modelData);

        let task = new OpaqueTask<ModelData, ModelTaskMetadata>(
            (data) =>
                data.setComponent(
                    ModelComponent.DataGraph,
                    <number> data.getComponent<number>(ModelComponent.DataGraph) + 1),
            graphTweakMetadata);

        model.registerObserver((changeBuf) => {
            expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
            return [task];
        });

        model.tasks.schedule(task);

        model.tasks.processTask();
        expect(model.tasks.isEmpty()).toEqual(false);
        model.tasks.processTask();
        expect(model.tasks.isEmpty()).toEqual(false);
        expect(modelData.getComponent<number>(ModelComponent.DataGraph)).toEqual(2);
    });

    it("catches tasks that read things they aren't supposed to", () => {
        let modelData = new ModelData();
        modelData.setComponent(ModelComponent.DataGraph, 42);
        modelData.drainBuffers();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => { data.getComponent<number>(ModelComponent.DataGraph); },
                [],
                []));
        expect(() => model.tasks.processAllTasks()).toThrow();
    });

    it("catches tasks that write things they aren't supposed to", () => {
        let modelData = new ModelData();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => { data.setComponent(ModelComponent.DataGraph, 42); },
                [],
                []));
        expect(() => model.tasks.processAllTasks()).toThrow();
    });

    it("catches tasks that don't write after they promise to do so", () => {
        let modelData = new ModelData();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => { },
                [],
                [ModelComponent.DataGraph]));
        expect(() => model.tasks.processAllTasks()).toThrow();
    });

    it("executes tasks that write after they promised to", () => {
        let modelData = new ModelData();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => { data.setComponent(ModelComponent.DataGraph, 42); },
                [],
                [ModelComponent.DataGraph]));
        // The "test" is that this statement doesn't throw.
        model.tasks.processAllTasks();
    });

    it("does not mistake read-after-write for a read", () => {
        let modelData = new ModelData();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => {
                    data.setComponent(ModelComponent.DataGraph, 42);
                    data.getComponent<number>(ModelComponent.DataGraph);
                },
                [],
                [ModelComponent.DataGraph]));
        // The "test" is that this statement doesn't throw.
        model.tasks.processAllTasks();
    });

    it("catches in-order tasks that read things they aren't supposed to in an unchecked way", () => {
        let modelData = new ModelData();
        modelData.setComponent(ModelComponent.DataGraph, 42);
        modelData.drainBuffers();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => { data.getComponentUnchecked<number>(ModelComponent.DataGraph); },
                [],
                []));
        expect(() => model.tasks.processAllTasks()).toThrow();
    });

    it("catches tasks that write things they aren't supposed to in an unchecked way", () => {
        let modelData = new ModelData();
        let model = new Model(modelData);
        model.tasks.schedule(
            Model.createTask(
                data => { data.setComponentUnchecked(ModelComponent.DataGraph, 42); },
                [],
                []));
        expect(() => model.tasks.processAllTasks()).toThrow();
    });
});
