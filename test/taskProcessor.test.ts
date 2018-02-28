import * as TaskProcessor from "../src/entities/taskProcessor";

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
        let task = new TaskProcessor.ProcessorTask<NumberBox, number>(
            (box) => box.num++, 0);
        processor.schedule(task);
        expect(processor.isScheduleEmpty).toEqual(false);
        processor.processTask();
        expect(numBox.num).toEqual(1);
    });
});
