import {Parser} from "./parser";

export class FileDAO implements DataAccessObjectInterface {
    // works at the granularity of entire graphs!
    // will need the RDF API to actually implement this stuff
    // (the output of this will have to pass through the modulator),
    // as well as basic file IO
    private parser: Parser;
    public constructor() {
        this.parser = new Parser();
    }
    public insert(file: any) {
        return;
    }
    public find(file: any) {
        return this.readFromFile(file);
    }
    public update(file: any) {
        return;
    }

    private readFromFile(file: any) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = onLoadFunction;
        reader.onloadend = onLoadEndFunction;

        let parser = this.parser;
        let store = null;
        function onLoadFunction(evt: any) {
            parser.parse(evt.target.result);
        }

        function onLoadEndFunction(evt: any) {
            store = parser.getStore();
            parser.prepare();
        }

        return store;
    }

    private writeToFile(file: any) {

    }
}
