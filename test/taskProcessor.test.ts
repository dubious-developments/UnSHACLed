import * as Collections from "typescript-collections";
import * as TaskProcessor from "../src/entities/taskProcessor";
import { OpaqueTask, Task } from "../src/entities/task";

class NumberBox {
    public constructor(public num: number) {

    }
}

describe("InOrderProcessor Class", () => {

    it("should be empty initially", () => {
        let processor = new TaskProcessor.InOrderProcessor<NumberBox, number>(
            new NumberBox(0));
        expect(processor.isEmpty()).toEqual(true);
    });

    it("should execute tasks", () => {
        let numBox = new NumberBox(0);
        let processor = new TaskProcessor.InOrderProcessor<NumberBox, number>(
            numBox);
        let task = new OpaqueTask<NumberBox, number>(
            (box) => box.num++, 0);
        processor.schedule(task);
        expect(processor.isEmpty()).toEqual(false);
        processor.processAllTasks();
        expect(numBox.num).toEqual(1);
    });

    it("should not run forever unless we want it to", () => {
        let processor = new TaskProcessor.InOrderProcessor<void, void>(
            undefined);
        let taskCount = 0;
        let createTask = (createNext) => new OpaqueTask<void, void>(
            (nothing) => { taskCount += 1; processor.schedule(createNext(createNext)); }, undefined);
        processor.schedule(createTask(createTask));

        let before = Date.now();
        processor.processTasksDuring(500);
        let after = Date.now();
        expect(after - before).toBeLessThanOrEqual(1000);
        expect(taskCount).toBeGreaterThan(1);
    });
});
