import { ModelTaskMetadata, ModelComponent, Model, ModelData } from "../source/entities/model";
import { Set } from "typescript-collections";
import { ProcessorTask } from "../source/entities/taskProcessor";

let graphReadSet = new Set<ModelComponent>();
graphReadSet.add(ModelComponent.DataGraph);
let graphWriteSet = new Set<ModelComponent>();
graphWriteSet.add(ModelComponent.DataGraph);
let graphTweakMetadata = new ModelTaskMetadata(graphReadSet, graphWriteSet);

describe("ModelTaskMetadata Class", () => {
    it("should have sensible readsFrom/writesTo implementations", () => {
        expect(graphTweakMetadata.readsFrom(ModelComponent.DataGraph)).toEqual(true);
        expect(graphTweakMetadata.writesTo(ModelComponent.DataGraph)).toEqual(true);
    });
});

describe("Model Class", () => {
    it("can be created", () => {
        new Model()
    });

    it("should notify observers", () => {
        let modelData = new ModelData();
        modelData.setComponent(ModelComponent.DataGraph, 0);
        let model = new Model(modelData);

        let task = new ProcessorTask<ModelData, ModelTaskMetadata>(
            (data) =>
                data.setComponent(
                    ModelComponent.DataGraph,
                    data.getComponent<number>(ModelComponent.DataGraph) + 1),
            graphTweakMetadata);

        model.registerObserver((changeBuf) => {
            expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
            return [task];
        });

        model.tasks.schedule(task);

        model.tasks.processTask();
        expect(model.tasks.isScheduleEmpty).toEqual(false);
        model.tasks.processTask();
        expect(model.tasks.isScheduleEmpty).toEqual(false);
        expect(modelData.getComponent<number>(ModelComponent.DataGraph)).toEqual(2);
    });
});