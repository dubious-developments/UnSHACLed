export class Graph {
    private map: {};

    public constructor() {
        this.map = {};
    }

    public addStore(filename: string, store: any) {
        this.map[filename] = store;
    }


}