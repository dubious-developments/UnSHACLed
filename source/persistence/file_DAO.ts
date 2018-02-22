import {Parser} from "./parser";

export class FileDAO implements DataAccessObjectInterface {
    // works on the granularity of entire graphs!
    // will need the RDF API to actually implement this stuff
    // (the output of this will have to pass through the modulator),
    // as well as basic file IO
    private parser: Parser;
    public constructor() {
        this.parser = new Parser();
    }
    public insert(uri: string) {
        return;
    }
    public find(uri: string) {
        this.parser.parse(new Uri(uri));
        return;
    }
    public delete(uri: string) {
        return;
    }
    public update(uri: string) {
        return;
    }
}
