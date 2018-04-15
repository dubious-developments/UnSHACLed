import * as Collections from "typescript-collections";
import { TimeCapsule } from "../src/entities/timeCapsule";

class NumberBox {
    public constructor(public num: number) {

    }
}

describe("TimeCapsule Class", () => {

    it("can be created", () => {
        let capsule = TimeCapsule.create<NumberBox>(new NumberBox(10));
        expect(capsule.get().num).toEqual(10);
    });

    it("supports linear changes", () => {
        let root = TimeCapsule.create<NumberBox>(new NumberBox(10));
        let leaf = root.modify(box => box.num++, box => box.num--);
        expect(root.get().num).toEqual(10);
        expect(leaf.get().num).toEqual(11);
        expect(leaf.get().num).toEqual(11);
        expect(root.get().num).toEqual(10);
        expect(leaf.get().num).toEqual(11);
    });

    it("supports trees of changes", () => {
        let root = TimeCapsule.create<NumberBox>(new NumberBox(0));
        let instants: [TimeCapsule<NumberBox>, number][] = [[root, 0]];
        // First generate a random tree of changes.
        for (let i = 0; i < 100; i++) {
            let index = Math.floor(instants.length * Math.random());
            let [original, value] = instants[index];
            let delta = Math.floor(10 * Math.random());
            let modified = original.modify(box => box.num += delta, box => box.num -= delta);
            instants.push([modified, value + delta]);
        }
        // Then check that we can move between instants.
        for (let i = 0; i < 5000; i++) {
            let index = Math.floor(instants.length * Math.random());
            let [instant, value] = instants[index];
            expect(instant.get().num).toEqual(value);
        }
    });
});
