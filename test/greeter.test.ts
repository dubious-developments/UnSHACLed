import Greeter from "../source/entities/greeter";

describe("Greeter Class", () => {

    it("Should set msg when an instance is created", () => {
        let expected = "world!";
        let greater = new Greeter(expected);
        expect(greater.greeting).toEqual(expected);
    });

    it("Should greet", () => {
        let greet = "world!";
        let greater = new Greeter(greet);
        let actual = greater.greet();
        let expected = `Hello, ${greet}`;
        expect(actual).toEqual(expected);
    });

});
