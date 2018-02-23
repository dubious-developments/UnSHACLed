import { ModelTaskMetadata, ModelComponent } from "../source/entities/model";
import { Set } from "typescript-collections";

describe("ModelTaskMetadata Class", () => {

    it("should have sensible readsFrom/writesTo implementations", () => {
        let readSet = new Set<ModelComponent>();
        readSet.add(ModelComponent.DataGraph);
        let writeSet = new Set<ModelComponent>();
        writeSet.add(ModelComponent.DataGraph);
        let meta = new ModelTaskMetadata(readSet, writeSet);
        expect(meta.readsFrom(ModelComponent.DataGraph)).toEqual(true);
        expect(meta.writesTo(ModelComponent.DataGraph)).toEqual(true);
    });
});
