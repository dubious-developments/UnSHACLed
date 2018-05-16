import {DataAccessProvider} from "../src/persistence/dataAccessProvider";

describe("DataAccessProvider Class", () => {
    it("can be created.",
        () => {
            expect(DataAccessProvider.getInstance()).toBeDefined();
        });

    it("can retrieve the model.",
        () => {
            let dap = DataAccessProvider.getInstance();
            expect(dap.model).toBeDefined();
        });

    it("can retrieve the validation service.",
        () => {
            let dap = DataAccessProvider.getInstance();
            expect(dap.getValidationService()).toBeDefined();
        });

    it("can retrieve a file DAO.",
        () => {
            let dap = DataAccessProvider.getInstance();
            expect(dap.getFileDAO()).toBeDefined();
        });
});