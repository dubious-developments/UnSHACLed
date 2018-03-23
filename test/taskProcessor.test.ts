import * as TaskProcessor from "../src/entities/taskProcessor";
import { OpaqueTask } from "../src/entities/task";

class NumberBox {
    public constructor(public num: number) {

    }
}

describe("TaskProcessor Class", () => {

    it("should be empty initially", () => {
        let processor = new TaskProcessor.TaskProcessor<NumberBox, number>(
            new NumberBox(0));
        expect(processor.isScheduleEmpty).toEqual(true);
    });

    it("should execute tasks", () => {
        let numBox = new NumberBox(0);
        let processor = new TaskProcessor.TaskProcessor<NumberBox, number>(
            numBox,
            new TaskProcessor.FifoTaskQueue<NumberBox, number>());
        let task = new OpaqueTask<NumberBox, number>(
            (box) => box.num++, 0);
        processor.schedule(task);
        expect(processor.isScheduleEmpty).toEqual(false);
        processor.processAllTasks();
        expect(numBox.num).toEqual(1);
    });

    it("should not run forever unless we want it to", () => {
        let processor = new TaskProcessor.TaskProcessor<void, void>(
            undefined,
            new TaskProcessor.FifoTaskQueue<void, void>());
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
