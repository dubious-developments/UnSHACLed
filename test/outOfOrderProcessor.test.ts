import { OutOfOrderProcessor } from "../src/entities/outOfOrderProcessor";
import { TaskQueue } from "../src/entities/taskQueue";
import { ModelTaskMetadata, ModelComponent } from "../src/entities/modelTaskMetadata";
import { ModelData, Model } from "../src/entities/model";
import { Task } from "../src/entities/task";
import { PriorityGenerator } from "../src/entities/priorityPartitionedQueue";
import { TaskProcessor } from "../src/entities/taskProcessor";

function processNonEmpty<TData, TMetadata>(
    queue: TaskProcessor<TData, TMetadata>): void {

    expect(queue.processTask()).toEqual(true);
}

describe("OutOfOrderProcessor Class", () => {
    it("can be created", () => {
        new OutOfOrderProcessor(new ModelData());
    });

    it("is initially empty", () => {
        let queue = new OutOfOrderProcessor(new ModelData());
        expect(queue.isEmpty()).toEqual(true);
        expect(queue.processTask()).toEqual(false);
    });

    it("supports scheduling tasks", () => {
        let queue = new OutOfOrderProcessor(new ModelData());
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        expect(queue.isEmpty()).toEqual(false);
    });

    it("supports processing tasks", () => {
        let count = 0;
        let queue = new OutOfOrderProcessor(new ModelData());
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { count++; },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        expect(queue.isEmpty()).toEqual(false);
        processNonEmpty(queue);
        expect(queue.isEmpty()).toEqual(true);
        expect(count).toEqual(1);
    });

    it("supports processing dependent tasks", () => {
        let count = 0;
        let queue = new OutOfOrderProcessor(new ModelData());
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { count++; },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { count++; },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        expect(queue.isEmpty()).toEqual(false);
        processNonEmpty(queue);
        processNonEmpty(queue);
        expect(queue.isEmpty()).toEqual(true);
        expect(count).toEqual(2);
    });

    it("correctly prioritizes tasks", () => {
        let count = 0;
        let queue = new OutOfOrderProcessor(new ModelData());
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { if (count === 0) { count = 1; } },
                [],
                [ModelComponent.DataGraph],
                0));
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { if (count === 2) { count = 3; } },
                [ModelComponent.DataGraph],
                [],
                1));
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { if (count === 1) { count = 2; } },
                [ModelComponent.DataGraph],
                [],
                2));
        expect(queue.isEmpty()).toEqual(false);
        processNonEmpty(queue);
        processNonEmpty(queue);
        processNonEmpty(queue);
        expect(queue.isEmpty()).toEqual(true);
        expect(count).toEqual(3);
    });

    it("updates data in correct order", () => {
        let data = new ModelData();
        let queue = new OutOfOrderProcessor(data);
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { data.setComponent<number>(ModelComponent.DataGraph, 1); },
                [],
                [ModelComponent.DataGraph]));
        queue.schedule(
            Model.createTask(
                (data: ModelData) => { data.setComponent<number>(ModelComponent.DataGraph, 2); },
                [],
                [ModelComponent.DataGraph],
                1));

        expect(queue.isEmpty()).toEqual(false);
        processNonEmpty(queue);
        processNonEmpty(queue);
        expect(queue.isEmpty()).toEqual(true);
        expect(<number> data.getComponent<number>(ModelComponent.DataGraph)).toEqual(2);
    });
});

describe("PriorityGenerator Class", () => {
    it("generates all-zeros by default", () => {
        let gen = new PriorityGenerator();
        for (let i = 0; i < 10; i++) {
            expect(gen.next()).toEqual(0);
        }
    });

    it("understands no-op notifications", () => {
        let gen = new PriorityGenerator();
        gen.notifyPriorityExists(0);
        for (let i = 0; i < 10; i++) {
            expect(gen.next()).toEqual(0);
        }
    });

    it("generates the right sequence between -2 and 3", () => {
        let gen = new PriorityGenerator();

        let expectation = [
            // One cycle.
            3,
            3, 2,
            3, 2, 1,
            3, 2, 1, 0,
            3, 2, 1, 0, -1,
            3, 2, 1, 0, -1, -2,
            // Once more, with feeling.
            3,
            3, 2,
            3, 2, 1,
            3, 2, 1, 0,
            3, 2, 1, 0, -1,
            3, 2, 1, 0, -1, -2
        ];

        gen.notifyPriorityExists(3);
        gen.notifyPriorityExists(-2);

        for (let i = 0; i < expectation.length; i++) {
            expect(gen.next()).toEqual(expectation[i]);
        }
    });
});